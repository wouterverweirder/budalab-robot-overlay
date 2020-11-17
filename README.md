# Nodejs service om overlay.png te maken

1. Installeer nodejs op de pi
2. cd in deze directory en doe `npm install`
3. start het script met `npm start` - dit runt in de CLI

## ffmpeg commands

Capture Local:

`ffplay udp://127.0.0.1:1234`

Stream with overlay:

`ffmpeg -f avfoundation -framerate 30 -i "1" -f image2 -re -stream_loop -1 -i output/overlay.png -filter_complex overlay -preset ultrafast -vcodec libx264 -tune zerolatency -b 900k -f mpegts udp://127.0.0.1:1234`

## UDP input data

Wanneer de service runt, dan kun je sensor / input data via UDP sturen om te gebruiken in de overlay. Onderstaand Python script toont hier een voorbeeldje van. Let op dat de doorgestuurde string valid JSON is (dus geen trailing commas). Je kan uiteraard die udp socket "open" laten en op een timed interval data doorsturen.

```python
import socket
import sys

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, 0)

send_data = """
{
  "Sensors": {
    "Pressure":{"Min": 800, "Max": 1500, "Value": 1200},
    "Temperature":{"Min": 5, "Max": 30, "Value": 15},
    "Humidity":{"Min": 0, "Max": 100, "Value": 30},
    "CO2":{"Min": 200, "Max": 3000, "Value": 900},
    "Battery":{"Min": 0, "Max": 100, "Value": 70},
    "RSSI":{"Min": 0, "Max": 100, "Value": 70}
  },
  "RoverInput":{
    "TotalVotingTime": 15,
    "RemainingVotingTime": 2,
    "VotesLeft": 10,
    "VotesRight": 20,
    "VotesForward": 30
  }
}
"""

s.sendto(send_data.encode('utf-8'), ("127.0.0.1", 41234))
s.close()
```