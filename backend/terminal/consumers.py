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
        "--no3d",
        "--nodvd",
        "--nogroups",
        "--noinput",
        "--nonewprivs",
        "--noroot",
        "--nosound",
        "--notv",
        "--nou2f",
        "--novideo",
        "--memory-deny-write-execute",
        "--", 
        *argv
    ]
    return cmd

class TerminalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query = parse_qs(self.scope["query_string"].decode())
        session_id = query.get("session", [None])[0]
        if not session_id:
            await self.send(text_data=json.dumps({"error": "Session ID is required"}))
            await self.close()
            return
        
        self.session_id = session_id
        self.workspace = tempfile.mkdtemp(prefix=f"firejail_{session_id}_")
        self.reader_running = False
        self.master_fd = None
        self.proc = None
        
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
        """Spawn a sandboxed shell using firejail"""
        argv = ["/bin/bash", "-li"]
        cmd = build_firejail_cmd(self.workspace, argv)
        
        master_fd, slave_fd = pty.openpty()
        
        # Set master_fd to non-blocking
        flags = fcntl.fcntl(master_fd, fcntl.F_GETFL)
        fcntl.fcntl(master_fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)

        # Set up environment
        env = os.environ.copy()
        env.update({
            'PS1': r'\[\033[01;32m\]\u@learnlinux\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ ',
            'TERM': 'xterm-256color',
            'HOME': self.workspace,
            'USER': 'learner',
            'SHELL': '/bin/bash',
            'LANG': 'en_US.UTF-8',
            'LC_ALL': 'en_US.UTF-8'
        })

        try:
            proc = subprocess.Popen(
                cmd,
                cwd=self.workspace,
                stdin=slave_fd,
                stdout=slave_fd,
                stderr=slave_fd,
                close_fds=True,
                env=env
            )
            
            os.close(slave_fd)
            return master_fd, proc
            
        except Exception as e:
            os.close(slave_fd)
            os.close(master_fd)
            raise e

    async def read_output(self):
        """Enhanced async method to read output from the terminal"""
        buffer = b""
        
        while self.reader_running:
            try:
                # Use select to check if data is available
                ready, _, _ = await sync_to_async(select.select)([self.master_fd], [], [], 0.1)
                
                if ready:
                    try:
                        data = await sync_to_async(os.read)(self.master_fd, 4096)
                        if data:
                            buffer += data
                            
                            # Process complete lines
                            while b'\n' in buffer or b'\r' in buffer:
                                if b'\r\n' in buffer:
                                    line, buffer = buffer.split(b'\r\n', 1)
                                    line += b'\n'
                                elif b'\n' in buffer:
                                    line, buffer = buffer.split(b'\n', 1)
                                    line += b'\n'
                                elif b'\r' in buffer:
                                    line, buffer = buffer.split(b'\r', 1)
                                    line += b'\n'
                                else:
                                    break
                                
                                try:
                                    output = line.decode('utf-8', errors='replace')
                                    if output.strip():  # Only send non-empty output
                                        await self.send(text_data=json.dumps({"output": output}))
                                except UnicodeDecodeError:
                                    # Handle binary data
                                    output = line.decode('utf-8', errors='ignore')
                                    if output.strip():
                                        await self.send(text_data=json.dumps({"output": output}))
                            
                            # If buffer has data but no complete lines, send it after a delay
                            if buffer and len(buffer) > 0:
                                try:
                                    partial_output = buffer.decode('utf-8', errors='replace')
                                    if partial_output.strip():
                                        await asyncio.sleep(0.1)  # Small delay for more data
                                        ready_again, _, _ = await sync_to_async(select.select)([self.master_fd], [], [], 0.05)
                                        if not ready_again:  # No more data coming
                                            await self.send(text_data=json.dumps({"output": partial_output}))
                                            buffer = b""
                                except UnicodeDecodeError:
                                    buffer = b""
                        
                    except (OSError, IOError) as e:
                        if e.errno == errno.EIO:  # End of file
                            break
                        logger.error(f"Error reading from terminal: {e}")
                        break
                else:
                    # No data available, small delay to prevent busy waiting
                    await asyncio.sleep(0.01)
                    
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
                    self.proc.terminate()
                    await sync_to_async(self.proc.wait)(timeout=5)
                except subprocess.TimeoutExpired:
                    self.proc.kill()
                    await sync_to_async(self.proc.wait)()
                except Exception as e:
                    logger.error(f"Error terminating process: {e}")
                    
            # Close file descriptors
            if hasattr(self, 'master_fd') and self.master_fd is not None:
                try:
                    os.close(self.master_fd)
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