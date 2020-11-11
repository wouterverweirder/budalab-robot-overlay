# Nodejs service om overlay.png te maken

1. Installeer nodejs op de pi
2. cd in deze directory en doe `npm install`
3. start het script met `npm start` - dit runt in de CLI

## ffmpeg commands

Capture Local:

`ffplay udp://127.0.0.1:1234`

Stream with overlay:

`ffmpeg -f avfoundation -framerate 30 -i "1" -f image2 -re -stream_loop -1 -i output/overlay.png -filter_complex overlay -preset ultrafast -vcodec libx264 -tune zerolatency -b 900k -f mpegts udp://127.0.0.1:1234`