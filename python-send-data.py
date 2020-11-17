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