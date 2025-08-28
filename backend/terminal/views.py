from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from terminal.serializer import TerminalCommandSerializer

class TerminalView(APIView):
    def get(self,request):
        serializer = TerminalCommandSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        command = serializer.validated_data.get("command")
        if command is None:
            return Response({"error":"No Command Provided"},status=status.HTTP_400_BAD_REQUEST)
        stripped_terminal_query = command.strip()
        # Code to execute the query
        result = {
            "message":"Success",
            "query":stripped_terminal_query
        }
        return Response(result,status=status.HTTP_200_OK)
    
    def post(self,request):
        serializer = TerminalCommandSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        command = serializer.validated_data.get("command")
        if command is None:
            return Response({"error":"No Command Provided"},status=status.HTTP_400_BAD_REQUEST)
        stripped_terminal_query = command.strip()
        # Code to execute the query
        result = {
            "message":"Success",
            "query":stripped_terminal_query
        }
        return Response(result,status=status.HTTP_200_OK)