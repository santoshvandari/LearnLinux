from rest_framework import serializers

class TerminalCommandSerializer(serializers.Serializer):
    command = serializers.CharField(required=True)
    