from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TerminalView(APIView):
    def get(self,request,terminal_command:str=None):
        print(terminal_command)
        if terminal_command is None:
            return Response({"error":"No Command Provided"},status=status.HTTP_400_BAD_REQUEST)
        stripped_terminal_query = terminal_command.strip()
        # Code to execute the query
        result = {
            "message":"Success"
        }
        return Response(result,status=status.HTTP_200_OK)