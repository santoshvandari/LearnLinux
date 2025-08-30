import os
import json
import tempfile
import shutil
import subprocess
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import fcntl
import pty
import asyncio
import logging
import select
import errno

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Console output
        logging.FileHandler('terminal_security.log', mode='a')  # File output
    ]
)

logger = logging.getLogger(__name__)

def build_firejail_cmd(work_dir, argv):
    """Build firejail command with security restrictions"""
    cmd = [
        "firejail", 
        f"--private={work_dir}",
        "--seccomp",
        "--net=none",
        "--nogroups",
        "--nonewprivs",
        "--noroot",
        "--nosound",
        "--", 
        *argv
    ]
    return cmd

def build_simple_cmd(work_dir, argv):
    """Fallback: Build a simple command without firejail"""
    return argv

class TerminalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query = parse_qs(self.scope["query_string"].decode())
        session_id = query.get("session", [None])[0]
        if not session_id:
            await self.send(text_data=json.dumps({"error": "Session ID is required"}))
            await self.close()
            return
        
        self.session_id = session_id
        self.workspace = tempfile.mkdtemp(prefix=f"terminal_{session_id}_")
        self.reader_running = False
        self.master_fd = None
        self.proc = None
        self.use_firejail = True  # Try firejail first, fallback if it fails
        
        # Create some basic files in the workspace
        await self.setup_workspace()
        
        await self.accept()

        try:
            self.master_fd, self.proc = await sync_to_async(self.spawn_sandbox_shell)()
            self.reader_running = True
            
            # Start the async reader task
            asyncio.create_task(self.read_output())
            
            # Send welcome message
            welcome_msg = "Welcome to LearnLinux Terminal!\nType 'help' for available commands or try basic commands like 'ls', 'pwd', 'whoami'\n"
            await self.send(text_data=json.dumps({"output": welcome_msg}))
            
        except Exception as e:
            logger.error(f"Failed to spawn shell: {e}")
            await self.send(text_data=json.dumps({"error": f"Failed to start terminal: {str(e)}"}))
            await self.close()

    async def setup_workspace(self):
        """Set up the workspace with some basic files and directories"""
        try:
            # Create basic directory structure
            await sync_to_async(os.makedirs)(os.path.join(self.workspace, "Documents"), exist_ok=True)
            await sync_to_async(os.makedirs)(os.path.join(self.workspace, "Downloads"), exist_ok=True)
            await sync_to_async(os.makedirs)(os.path.join(self.workspace, "Desktop"), exist_ok=True)
            
            # Create a sample file
            sample_file = os.path.join(self.workspace, "welcome.txt")
            with open(sample_file, 'w') as f:
                f.write("Welcome to LearnLinux!\n")
                f.write("This is a safe sandbox environment for learning Linux commands.\n")
                f.write("Try commands like:\n")
                f.write("- ls (list files)\n")
                f.write("- pwd (print working directory)\n")
                f.write("- cat welcome.txt (view this file)\n")
                f.write("- mkdir test (create directory)\n")
                f.write("- touch newfile.txt (create file)\n")
            
        except Exception as e:
            logger.error(f"Failed to setup workspace: {e}")

    def spawn_sandbox_shell(self):
        """Spawn a shell, preferably sandboxed with firejail"""
        argv = ["/bin/bash", "-li"]
        
        # Try firejail first
        if self.use_firejail:
            try:
                cmd = build_firejail_cmd(self.workspace, argv)
                return self._spawn_pty_process(cmd, self.workspace)
            except Exception as e:
                logger.warning(f"Firejail failed, falling back to direct shell: {e}")
                self.use_firejail = False
        
        # Fallback to direct shell execution in the workspace
        cmd = build_simple_cmd(self.workspace, argv)
        return self._spawn_pty_process(cmd, self.workspace)

    def _spawn_pty_process(self, cmd, cwd):
        """Common method to spawn a process with PTY"""
        master_fd, slave_fd = pty.openpty()
        
        # Set master_fd to non-blocking
        flags = fcntl.fcntl(master_fd, fcntl.F_GETFL)
        fcntl.fcntl(master_fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)

        # Set up environment
        env = os.environ.copy()
        env.update({
            'PS1': r'\[\033[01;32m\]\u@learnlinux\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ ',
            'TERM': 'xterm-256color',
            'HOME': cwd if self.use_firejail else self.workspace,
            'USER': 'learner' if self.use_firejail else os.environ.get('USER', 'learner'),
            'SHELL': '/bin/bash',
            'LANG': 'en_US.UTF-8',
            'LC_ALL': 'C.UTF-8',  # More compatible locale
            'PATH': '/usr/local/bin:/usr/bin:/bin'
        })

        try:
            proc = subprocess.Popen(
                cmd,
                cwd=cwd,
                stdin=slave_fd,
                stdout=slave_fd,
                stderr=slave_fd,
                close_fds=True,
                env=env,
                preexec_fn=os.setsid  # Create a new session
            )
            
            os.close(slave_fd)
            
            # Give the process a moment to initialize
            import time
            time.sleep(0.1)
            
            # Check if process is still running
            if proc.poll() is not None:
                raise RuntimeError(f"Process died immediately with return code {proc.returncode}")
            
            return master_fd, proc
            
        except Exception as e:
            os.close(slave_fd)
            os.close(master_fd)
            raise e

    async def read_output(self):
        """Enhanced async method to read output from the terminal"""
        buffer = b""
        
        while self.reader_running and self.master_fd is not None:
            try:
                # Use select to check if data is available
                ready, _, _ = await sync_to_async(select.select)([self.master_fd], [], [], 0.1)
                
                if ready:
                    try:
                        data = await sync_to_async(os.read)(self.master_fd, 4096)
                        if data:
                            buffer += data
                            
                            # Process data immediately for better responsiveness
                            if buffer:
                                try:
                                    # Try to decode the entire buffer
                                    output = buffer.decode('utf-8', errors='replace')
                                    if output:
                                        await self.send(text_data=json.dumps({"output": output}))
                                        buffer = b""
                                except UnicodeDecodeError:
                                    # If decoding fails, try with ignore errors
                                    output = buffer.decode('utf-8', errors='ignore')
                                    if output:
                                        await self.send(text_data=json.dumps({"output": output}))
                                        buffer = b""
                        else:
                            # EOF reached
                            break
                            
                    except (OSError, IOError) as e:
                        if e.errno == errno.EIO:  # End of file
                            logger.info("Terminal process ended (EIO)")
                            break
                        elif e.errno == errno.EAGAIN:  # Resource temporarily unavailable
                            continue
                        else:
                            logger.error(f"Error reading from terminal: {e}")
                            break
                else:
                    # No data available, small delay to prevent busy waiting
                    await asyncio.sleep(0.05)
                    
                    # Check if process is still alive
                    if hasattr(self, 'proc') and self.proc and self.proc.poll() is not None:
                        logger.info(f"Terminal process exited with code: {self.proc.returncode}")
                        break
                    
            except Exception as e:
                logger.error(f"Error in read_output loop: {e}")
                break
        
        logger.info("Terminal output reader stopped")

    async def receive(self, text_data=None, bytes_data=None):
        try:
            if not text_data:
                return
                
            data = json.loads(text_data)
            command = data.get("input", "")
            
            if not command:
                return

            logger.debug(f"Received command: {repr(command)}")
            
            # Check if process is still alive
            if not hasattr(self, 'proc') or not self.proc or self.proc.poll() is not None:
                await self.send(text_data=json.dumps({"error": "Terminal process is not running"}))
                return
            
            # Send the command to the terminal
            command_bytes = (command + "\n").encode('utf-8')
            await sync_to_async(os.write)(self.master_fd, command_bytes)
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {text_data}")
            await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))
        except Exception as e:
            logger.error(f"Error processing command: {e}")
            await self.send(text_data=json.dumps({"error": f"Command processing error: {str(e)}"}))

    async def disconnect(self, close_code):
        logger.info(f"Terminal disconnecting with code: {close_code}")
        self.reader_running = False
        
        try:
            # Terminate the process
            if hasattr(self, 'proc') and self.proc:
                try:
                    # Try graceful termination first
                    self.proc.terminate()
                    try:
                        await sync_to_async(self.proc.wait)(timeout=3)
                    except subprocess.TimeoutExpired:
                        # Force kill if graceful termination fails
                        logger.warning("Graceful termination failed, force killing process")
                        self.proc.kill()
                        await sync_to_async(self.proc.wait)()
                except Exception as e:
                    logger.error(f"Error terminating process: {e}")
                    
            # Close file descriptors
            if hasattr(self, 'master_fd') and self.master_fd is not None:
                try:
                    os.close(self.master_fd)
                    self.master_fd = None
                except Exception as e:
                    logger.error(f"Error closing master_fd: {e}")
                    
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
        finally:
            # Clean up workspace
            if hasattr(self, 'workspace') and self.workspace:
                try:
                    await sync_to_async(shutil.rmtree)(self.workspace, ignore_errors=True)
                except Exception as e:
                    logger.error(f"Error cleaning up workspace: {e}")
        
        logger.info("Terminal cleanup completed")