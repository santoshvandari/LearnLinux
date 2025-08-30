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
    """Build firejail command with security restrictions but better compatibility"""
    cmd = [
        "firejail", 
        f"--private={work_dir}",
        "--seccomp",
        "--net=none",
        "--nonewprivs",
        "--noroot",
        "--nosound",
        "--noprofile",  # Disable default profile to reduce conflicts
        "--quiet",      # Reduce verbose output
        "--shell=none", # Don't interfere with shell selection
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
            logger.error("No session ID provided")
            await self.send(text_data=json.dumps({"type": "error", "data": "Session ID is required"}))
            await self.close()
            return
        
        self.session_id = session_id
        self.reader_running = False
        self.master_fd = None
        self.proc = None
        self.use_firejail = False  # Disable firejail for now to avoid startup issues
        
        try:
            self.workspace = tempfile.mkdtemp(prefix=f"terminal_{session_id}_")
            logger.info(f"Created workspace: {self.workspace}")
            
            # Create some basic files in the workspace
            await self.setup_workspace()
            
            await self.accept()
            logger.info(f"WebSocket connection accepted for session: {session_id}")

            # Start the terminal process
            self.master_fd, self.proc = await sync_to_async(self.spawn_sandbox_shell)()
            logger.info(f"Terminal process started with PID: {self.proc.pid}")
            
            self.reader_running = True
            
            # Start the async reader task
            asyncio.create_task(self.read_output())
            
            # Send welcome message with a small delay to ensure connection is stable
            await asyncio.sleep(1.0)  # Increased delay to let shell initialize
            
            # Check if process is still running before sending welcome
            if self.proc.poll() is not None:
                logger.error(f"Shell process died before welcome message, exit code: {self.proc.returncode}")
                await self.send(text_data=json.dumps({"type": "error", "data": "Terminal process failed to initialize"}))
                await self.close()
                return
            
            welcome_msg = "Welcome to LearnLinux Terminal!\n$ "
            message_data = json.dumps({"type": "output", "data": welcome_msg})
            logger.debug(f"Sending welcome message: {repr(message_data)}")
            await self.send(text_data=message_data)
            logger.info("Welcome message sent successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize terminal session: {e}")
            try:
                error_msg = json.dumps({"type": "error", "data": f"Failed to start terminal: {str(e)}"})
                logger.debug(f"Sending error message: {repr(error_msg)}")
                await self.send(text_data=error_msg)
            except Exception as send_error:
                logger.error(f"Failed to send error message: {send_error}")
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
        """Spawn a shell in the workspace"""
        # Try different shells in order of preference
        shells_to_try = [
            "/bin/sh",
            "/usr/bin/sh", 
            "/bin/bash",
            "/usr/bin/bash"
        ]
        
        for shell in shells_to_try:
            if os.path.exists(shell):
                logger.info(f"Using shell: {shell}")
                if 'bash' in shell:
                    argv = [shell, '-i']  # Interactive mode for bash
                else:
                    argv = [shell]
                cmd = build_simple_cmd(self.workspace, argv)
                try:
                    return self._spawn_pty_process(cmd, self.workspace)
                except Exception as e:
                    logger.warning(f"Failed to start {shell}: {e}")
                    continue
        
        raise RuntimeError("No suitable shell found")

    def _spawn_pty_process(self, cmd, cwd):
        """Common method to spawn a process with PTY"""
        master_fd = None
        slave_fd = None
        
        try:
            master_fd, slave_fd = pty.openpty()
            
            # Set master_fd to non-blocking
            flags = fcntl.fcntl(master_fd, fcntl.F_GETFL)
            fcntl.fcntl(master_fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)

            # Set up environment
            env = os.environ.copy()
            env.update({
                'PS1': r'\$ ',  # Simple prompt to reduce control sequences
                'TERM': 'linux',  # Better terminal type for compatibility
                'HOME': self.workspace,
                'USER': os.environ.get('USER', 'learner'),
                'SHELL': cmd[0],
                'LANG': 'C.UTF-8',  # Use C locale to avoid encoding issues
                'LC_ALL': 'C.UTF-8',  # Use C locale to avoid encoding issues
                'PATH': '/usr/local/bin:/usr/bin:/bin',
                # Disable shell initialization files that might cause issues
                'BASH_ENV': '/dev/null',
                'ENV': '/dev/null',
                'HISTFILE': '/dev/null',  # Disable history to avoid file access issues
                'HISTSIZE': '0',
                'HISTFILESIZE': '0',
                # Disable shell integration features
                'PROMPT_COMMAND': '',
                'HISTCONTROL': 'ignoreboth',
                # Disable bracketed paste mode
                'TERM_PROGRAM': '',
                'ITERM_SESSION_ID': '',
                'COLORTERM': 'true',
                # Terminal size
                'COLUMNS': '80',
                'LINES': '24',
            })

            def preexec_function():
                os.setsid()
                try:
                    os.tcsetpgrp(0, os.getpid())
                except OSError:
                    pass  # Ignore if not supported
            
            try:
                proc = subprocess.Popen(
                    cmd,
                    cwd=cwd,
                    stdin=slave_fd,
                    stdout=slave_fd,
                    stderr=slave_fd,
                    close_fds=True,
                    env=env,
                    preexec_fn=preexec_function
                )
                
                # Close slave_fd in parent process
                os.close(slave_fd)
                slave_fd = None
                
                # Give the process a moment to initialize
                import time
                time.sleep(1)  # Increased delay for better initialization
                
                # Check if process is still running after initialization
                if proc.poll() is not None:
                    stdout, stderr = proc.communicate()
                    error_msg = f"Process died immediately after initialization with return code {proc.returncode}"
                    if stderr:
                        error_msg += f"\nStderr: {stderr.decode('utf-8', errors='replace')}"
                    if stdout:
                        error_msg += f"\nStdout: {stdout.decode('utf-8', errors='replace')}"
                    logger.error(error_msg)
                    raise RuntimeError(error_msg)
                
                logger.info(f"Process started successfully with PID: {proc.pid}")
                return master_fd, proc
                
            except Exception as e:
                logger.error(f"Failed to start process: {e}")
                if proc:
                    try:
                        proc.terminate()
                        proc.wait(timeout=5)
                    except:
                        try:
                            proc.kill()
                        except:
                            pass
                raise e
                
        except Exception as e:
            logger.error(f"Failed to create PTY: {e}")
            # Clean up file descriptors if they were created
            if slave_fd is not None:
                try:
                    os.close(slave_fd)
                except:
                    pass
            if master_fd is not None:
                try:
                    os.close(master_fd)
                except:
                    pass
            raise e

    async def read_output(self):
        """Enhanced async method to read output from the terminal"""
        buffer = b""
        consecutive_empty_reads = 0
        
        while self.reader_running and self.master_fd is not None:
            try:
                # Use select to check if data is available
                ready, _, _ = await sync_to_async(select.select)([self.master_fd], [], [], 0.1)
                
                if ready:
                    try:
                        data = await sync_to_async(os.read)(self.master_fd, 4096)
                        if data:
                            buffer += data
                            consecutive_empty_reads = 0
                            
                            # Process buffer for complete lines
                            while buffer:
                                try:
                                    # Try to decode the entire buffer
                                    output = buffer.decode('utf-8', errors='replace')
                                    
                                    # Process output for better readability
                                    if output:
                                        formatted_output = self.format_terminal_output(output)
                                        if formatted_output.strip():  # Only send non-empty content
                                            message_data = json.dumps({"type": "output", "data": formatted_output})
                                            logger.debug(f"Sending output message: {repr(message_data)}")
                                            await self.send(text_data=message_data)
                                        buffer = b""
                                        break
                                except UnicodeDecodeError:
                                    # If we can't decode, try to find a valid UTF-8 sequence
                                    for i in range(len(buffer) - 1, 0, -1):
                                        try:
                                            partial = buffer[:i].decode('utf-8')
                                            formatted_output = self.format_terminal_output(partial)
                                            if formatted_output.strip():
                                                await self.send(text_data=json.dumps({"type": "output", "data": formatted_output}))
                                            buffer = buffer[i:]
                                            break
                                        except UnicodeDecodeError:
                                            continue
                                    else:
                                        # If no valid sequence found, skip one byte and try again
                                        buffer = buffer[1:]
                        else:
                            # EOF reached
                            consecutive_empty_reads += 1
                            if consecutive_empty_reads > 10:  # Stop after multiple empty reads
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
        
        # Send final message to client
        try:
            await self.send(text_data=json.dumps({"type": "output", "data": "\nTerminal session ended.\n"}))
        except Exception as e:
            logger.warning(f"Could not send final message: {e}")

    def format_terminal_output(self, output):
        """Format terminal output for better readability"""
        if not output:
            return output
            
        # Remove common terminal escape sequences that cause formatting issues
        import re
        
        # Clean output while preserving ANSI color codes
        formatted = output
        
        # Remove terminal title sequences
        formatted = re.sub(r'\x1b\]0;[^\x07]*\x07', '', formatted)
        
        # Remove OSC (Operating System Command) sequences
        formatted = re.sub(r'\x1b\][\d;]*[^\x07\x1b]*(?:\x07|\x1b\\)', '', formatted)
        
        # Remove terminal control sequences like ]133;A\, ]133;B\, ]133;C\, ]133;D;
        formatted = re.sub(r'\]133;[A-Z];?[^\\]*\\', '', formatted)
        formatted = re.sub(r'\]133;[A-Z][^\\]*\\', '', formatted)
        
        # Remove file:// URL sequences
        formatted = re.sub(r'\]7;file://[^\\]*\\', '', formatted)
        
        # Remove bracketed paste mode sequences
        formatted = re.sub(r'\[\?2004[hl]', '', formatted)
        
        # Remove cursor positioning that might cause issues
        formatted = re.sub(r'\x1b\[H', '', formatted)
        formatted = re.sub(r'\x1b\[2J', '', formatted)
        
        # Remove excessive control characters but preserve basic ones
        formatted = re.sub(r'[\x00-\x08\x0E-\x1F\x7F]', '', formatted)
        
        # Clean up JSON input artifacts
        formatted = re.sub(r'\{"input":"[^"]*"\}', '', formatted)
        
        # Clean up excessive whitespace but preserve intentional spacing
        lines = formatted.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove trailing whitespace but preserve leading indentation
            cleaned_line = line.rstrip()
            
            # Skip lines that are just control sequences or artifacts
            if cleaned_line and not re.match(r'^[\[\]\\0-9;A-Za-z]*$', cleaned_line):
                cleaned_lines.append(cleaned_line)
            elif cleaned_line and len(cleaned_line) > 10:  # Keep longer lines even if they might have some control chars
                cleaned_lines.append(cleaned_line)
        
        # Join lines back together
        result = '\n'.join(cleaned_lines)
        
        # Remove duplicate newlines but preserve intentional paragraph breaks
        result = re.sub(r'\n{3,}', '\n\n', result)
        
        # Final cleanup - remove lines that are just artifacts
        result = re.sub(r'\n\s*\n\s*\n', '\n\n', result)
        
        return result.strip()

    async def receive(self, text_data=None, bytes_data=None):
        try:
            if not text_data:
                return
                
            logger.debug(f"Received raw message: {repr(text_data)}")
            
            # Handle both JSON and plain text input for compatibility
            try:
                data = json.loads(text_data)
                command = data.get("input", "")
                logger.debug(f"Parsed JSON message: {data}")
            except json.JSONDecodeError:
                # If it's not JSON, treat it as a direct command
                command = text_data.strip()
                logger.debug(f"Treated as plain text command: {repr(command)}")
            
            if not command:
                return

            logger.debug(f"Final command to execute: {repr(command)}")
            
            # Check if process is still alive
            if not hasattr(self, 'proc') or not self.proc or self.proc.poll() is not None:
                await self.send(text_data=json.dumps({"type": "error", "data": "Terminal process is not running"}))
                return
            
            # Check if master_fd is still valid
            if not hasattr(self, 'master_fd') or self.master_fd is None:
                await self.send(text_data=json.dumps({"type": "error", "data": "Terminal connection is not available"}))
                return
            
            # Send the command to the terminal
            try:
                command_bytes = (command + "\n").encode('utf-8')
                await sync_to_async(os.write)(self.master_fd, command_bytes)
                logger.debug(f"Command sent to terminal: {repr(command)}")
            except OSError as e:
                logger.error(f"Failed to write to terminal: {e}")
                await self.send(text_data=json.dumps({"type": "error", "data": f"Failed to send command: {str(e)}"}))
                
        except Exception as e:
            logger.error(f"Error processing command: {e}")
            try:
                await self.send(text_data=json.dumps({"type": "error", "data": f"Command processing error: {str(e)}"}))
            except Exception as send_error:
                logger.error(f"Failed to send error message: {send_error}")
            # Don't close the connection on command processing errors
            return

    async def disconnect(self, close_code):
        logger.info(f"Terminal disconnecting with code: {close_code}")
        self.reader_running = False
        
        # Close the master file descriptor first to stop the reader
        if hasattr(self, 'master_fd') and self.master_fd is not None:
            try:
                os.close(self.master_fd)
                logger.debug("Master file descriptor closed")
            except Exception as e:
                logger.warning(f"Error closing master_fd: {e}")
            finally:
                self.master_fd = None
        
        # Wait a moment for the reader to stop
        await asyncio.sleep(0.2)
        
        # Then terminate the process
        if hasattr(self, 'proc') and self.proc:
            try:
                # Try graceful termination first
                self.proc.terminate()
                try:
                    await sync_to_async(self.proc.wait)(timeout=5)
                    logger.debug("Process terminated gracefully")
                except (subprocess.TimeoutExpired, asyncio.TimeoutError):
                    # Force kill if graceful termination fails
                    logger.warning("Graceful termination failed, force killing process")
                    self.proc.kill()
                    try:
                        await sync_to_async(self.proc.wait)(timeout=2)
                        logger.debug("Process killed successfully")
                    except:
                        logger.warning("Failed to confirm process termination")
            except Exception as e:
                logger.error(f"Error terminating process: {e}")
            finally:
                self.proc = None
        
        # Clean up workspace
        if hasattr(self, 'workspace') and self.workspace:
            try:
                await sync_to_async(shutil.rmtree)(self.workspace, ignore_errors=True)
                logger.debug(f"Workspace cleaned up: {self.workspace}")
            except Exception as e:
                logger.error(f"Error cleaning up workspace: {e}")
        
        logger.info("Terminal cleanup completed")