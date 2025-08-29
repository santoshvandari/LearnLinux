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

logger = logging.getLogger(__name__)

def build_firejail_cmd(work_dir, argv):
    cmd = [
        "firejail", "--private={}".format(work_dir), "--seccomp", "--net=none", "--", *argv
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
        
        await self.accept()

        try:
            self.master_fd, self.proc = await sync_to_async(self.spawn_sandbox_shell)()
            self.reader_running = True
            # Start the async reader task
            asyncio.create_task(self.read_output())
            await self.send(text_data=json.dumps({"output": "Connected to sandboxed terminal.\n"}))
        except Exception as e:
            logger.error(f"Failed to spawn shell: {e}")
            await self.send(text_data=json.dumps({"error": f"Failed to start terminal: {str(e)}"}))
            await self.close()

    def spawn_sandbox_shell(self):
        argv = ["/bin/bash", "-li"]
        cmd = build_firejail_cmd(self.workspace, argv)
        master_fd, slave_fd = pty.openpty()
        
        # Set master_fd to non-blocking
        flags = fcntl.fcntl(master_fd, fcntl.F_GETFL)
        fcntl.fcntl(master_fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)

        proc = subprocess.Popen(
            cmd,
            cwd=self.workspace,
            stdin=slave_fd,
            stdout=slave_fd,
            stderr=slave_fd,
            close_fds=True
        )
        
        os.close(slave_fd)
        return master_fd, proc

    async def read_output(self):
        """Async method to read output from the terminal"""
        while self.reader_running:
            try:
                # Use sync_to_async to make the blocking read non-blocking in async context
                data = await sync_to_async(self.read_from_fd)()
                if data:
                    output = data.decode(errors='ignore')
                    logger.debug(f"Received data from shell: {output}")
                    await self.send(text_data=json.dumps({"output": output}))
                else:
                    # Small delay to prevent busy waiting
                    await asyncio.sleep(0.01)
            except Exception as e:
                logger.error(f"Error reading from terminal: {e}")
                break

    def read_from_fd(self):
        """Synchronous method to read from file descriptor"""
        try:
            return os.read(self.master_fd, 1024)
        except BlockingIOError:
            # No data available right now
            return None
        except OSError as e:
            logger.error(f"OSError reading from fd: {e}")
            return None

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data) if text_data else {}
            command = data.get("input", "")
            
            # Echo the command back to the client
            await self.send(text_data=json.dumps({"echo": command}))

            if command:
                logger.debug(f"Sending command to shell: {command}")
                # Add newline to execute the command
                command_with_newline = command + "\n"
                await sync_to_async(os.write)(self.master_fd, command_with_newline.encode())
                
        except Exception as e:
            logger.error(f"Error processing command: {e}")
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def disconnect(self, close_code):
        logger.info(f"Terminal disconnecting with code: {close_code}")
        self.reader_running = False
        
        try:
            if hasattr(self, 'proc'):
                self.proc.terminate()
                try:
                    self.proc.wait(timeout=1)
                except subprocess.TimeoutExpired:
                    self.proc.kill()
                    
            if hasattr(self, 'master_fd'):
                os.close(self.master_fd)
                
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
        finally:
            if hasattr(self, 'workspace'):
                shutil.rmtree(self.workspace, ignore_errors=True)