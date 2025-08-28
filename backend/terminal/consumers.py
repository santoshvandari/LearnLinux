import json
import subprocess
import os
import tempfile
import landlock
from channels.generic.websocket import AsyncWebsocketConsumer

class TerminalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_group_name = f"terminal_{self.user.id}"

        # Create a temporary directory for the user's session
        self.session_dir = tempfile.mkdtemp()

        # Apply Landlock sandboxing to restrict filesystem access
        self.sandbox = landlock.Sandbox(self.session_dir)
        self.sandbox.apply()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Clean up sandbox and session directory
        self.sandbox.cleanup()
        os.rmdir(self.session_dir)

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        command = data.get('command')

        if command:
            # Execute the command within the sandbox
            result = self.execute_command(command)
            await self.send(text_data=json.dumps({
                'output': result
            }))
        else:
            await self.send(text_data=json.dumps({
                'error': 'No command provided'
            }))

    def execute_command(self, command):
        try:
            # Execute the command in the user's sandboxed environment
            result = subprocess.run(
                command, shell=True, cwd=self.session_dir,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            return result.stdout.decode() + result.stderr.decode()
        except Exception as e:
            return str(e)
