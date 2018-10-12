#!/usr/bin/python3
from sys import stdin
from json import loads
from struct import unpack
from subprocess import call

def ReadMessage():

    # Read message length bytes
    LengthBytes = stdin.buffer.read(4)

    # Unpack length
    Length = unpack("i", LengthBytes)[0]

    # Return message as dict
    TextDecoded = stdin.buffer.read(Length).decode("utf-8")
    TextDict = loads(TextDecoded)
    return TextDict

MessageDict = ReadMessage()
MessageCapture = MessageDict["command"]

# call(["notify-send", MessageCapture])
call(["emacsclient", "-n", MessageCapture])
