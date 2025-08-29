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
            logger.warning("No session ID provided")
            await self.send(text_data=json.dumps({"error": "Session ID is required"}))
            await self.close()
            return
        self.session_id = session_id

        self.workspace = tempfile.mkdtemp(prefix=f"firejail_{session_id}_")
        await self.accept()

        self.master_fd, self.proc = await sync_to_async(self.spawn_sandbox_shell)()
        self.reader_task = await sync_to_async(self.start_reader)()

    def spawn_sandbox_shell(self):
        argv = ["/bin/bash", "-li"]
        cmd = build_firejail_cmd(self.workspace, argv)
        master_fd, slave_fd = pty.openpty()
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

    def start_reader(self):
        def reader():
            while True:
                try:
                    data = os.read(self.master_fd, 1024)
                except OSError:
                    break
                if data:
                    self.send(text_data=json.dumps({"output": data.decode(errors="ignore")}))
        import threading
        t = threading.Thread(target=reader, daemon=True)
        t.start()
        return t

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data) if text_data else {}
            command = data.get("input", "")
            logger.info(f"Received command: {command}")
            if command:
                logger.info(f"Received command: {command}")
                os.write(self.master_fd, command.encode())
        except Exception as e:
            logger.error(f"Error in receive: {e}")
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def disconnect(self, close_code):
        try:
            self.proc.terminate()
            self.proc.wait(timeout=1)
        except Exception:
            self.proc.kill()
        finally:
            os.close(self.master_fd)
            shutil.rmtree(self.workspace, ignore_errors=True)
