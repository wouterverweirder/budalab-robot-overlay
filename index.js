const fs = require('fs');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const { registerFont, createCanvas, loadImage } = require('canvas');

registerFont('assets/fonts/RobotoCondensed-Bold.ttf', { family: 'Roboto Condensed', weight: 'bold' });
registerFont('assets/fonts/RobotoCondensed-Light.ttf', { family: 'Roboto Condensed', weight: 300 });

const width = 1280;
const height = 720;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const COLORS = {
  YELLOW: '#F8CC46',
  BLUE: '#18112B'
};
const DEG_TO_RAD = Math.PI / 180;

let testBeeldImg, templateImg;
const batteryImg = [];
const wifiImg = [];
const arrowLeftImg = [];
const arrowRightImg = [];
const arrowUpImg = [];

const data = {
  "Sensors": {
    "Pressure":{"Min": 800, "Max": 1500, "Value": 1200},
    "Temperature":{"Min": 5, "Max": 30, "Value": 14},
    "Humidity":{"Min": 0, "Max": 100, "Value": 40},
    "CO2":{"Min": 200, "Max": 3000, "Value": 800},
    "Battery":{"Min": 0, "Max": 100, "Value": 80},
    "RSSI":{"Min": 0, "Max": 100, "Value": 80}
  },
  "RoverInput":{
    "TotalVotingTime": 20,
    "RemainingVotingTime": 5,
    "VotesLeft": 1,
    "VotesRight": 2,
    "VotesForward": 3
  },
};

server.on('message', (msg, rinfo) => {
  try {
    const receivedData = JSON.parse(msg);
    if (receivedData.Sensors) {
      if (receivedData.Sensors.Pressure) data.Sensors.Pressure = {...receivedData.Sensors.Pressure};
      if (receivedData.Sensors.Temperature) data.Sensors.Temperature = {...receivedData.Sensors.Temperature};
      if (receivedData.Sensors.Humidity) data.Sensors.Humidity = {...receivedData.Sensors.Humidity};
      if (receivedData.Sensors.CO2) data.Sensors.CO2 = {...receivedData.Sensors.CO2};
      if (receivedData.Sensors.Battery) data.Sensors.Battery = {...receivedData.Sensors.Battery};
      if (receivedData.Sensors.RSSI) data.Sensors.RSSI = {...receivedData.Sensors.RSSI};
    }
    if (receivedData.RoverInput) {
      if (receivedData.RoverInput.TotalVotingTime) data.RoverInput.TotalVotingTime = receivedData.RoverInput.TotalVotingTime;
      if (receivedData.RoverInput.RemainingVotingTime) data.RoverInput.RemainingVotingTime = receivedData.RoverInput.RemainingVotingTime;
      if (receivedData.RoverInput.VotesLeft) data.RoverInput.VotesLeft = receivedData.RoverInput.VotesLeft;
      if (receivedData.RoverInput.VotesRight) data.RoverInput.VotesRight = receivedData.RoverInput.VotesRight;
      if (receivedData.RoverInput.VotesForward) data.RoverInput.VotesForward = receivedData.RoverInput.VotesForward;
    }
  } catch (e) {
    console.log(`decode failed: ${msg} from ${rinfo.address}:${rinfo.port}`);
    console.log(e);
  }
});
server.bind(41234);

const init = async () => {
  // testBeeldImg = await loadImage('assets/testbeeld.jpg');
  templateImg = await loadImage('assets/template.png');
  batteryImg.push(await loadImage('assets/icon-battery0.png'));
  batteryImg.push(await loadImage('assets/icon-battery25.png'));
  batteryImg.push(await loadImage('assets/icon-battery50.png'));
  batteryImg.push(await loadImage('assets/icon-battery75.png'));
  batteryImg.push(await loadImage('assets/icon-battery100.png'));
  wifiImg.push(await loadImage('assets/icon-wifi0.png'));
  wifiImg.push(await loadImage('assets/icon-wifi25.png'));
  wifiImg.push(await loadImage('assets/icon-wifi50.png'));
  wifiImg.push(await loadImage('assets/icon-wifi75.png'));
  wifiImg.push(await loadImage('assets/icon-wifi100.png'));
  arrowLeftImg.push(await loadImage('assets/arrowleft.png'));
  arrowLeftImg.push(await loadImage('assets/arrowleft-select.png'));
  arrowRightImg.push(await loadImage('assets/arrowright.png'));
  arrowRightImg.push(await loadImage('assets/arrowright-select.png'));
  arrowUpImg.push(await loadImage('assets/arrowup.png'));
  arrowUpImg.push(await loadImage('assets/arrowup-select.png'));

  const updateFrame = () => {
    // data.RoverInput.RemainingVotingTime--;
    // if (data.RoverInput.RemainingVotingTime < 0) {
    //   data.RoverInput.RemainingVotingTime = data.RoverInput.TotalVotingTime;
    // }

    // data.RoverInput.VotesLeft = Math.floor(map(Math.random(), 0, 1, 0, 50));
    // data.RoverInput.VotesRight = Math.floor(map(Math.random(), 0, 1, 0, 50));
    // data.RoverInput.VotesForward = Math.floor(map(Math.random(), 0, 1, 0, 50));

    // data.Sensors.Battery.Value-=10;
    // if (data.Sensors.Battery.Value < 0) {
    //   data.Sensors.Battery.Value = data.Sensors.Battery.Max;
    // }
    // data.Sensors.RSSI.Value-=10;
    // if (data.Sensors.RSSI.Value < 0) {
    //   data.Sensors.RSSI.Value = data.Sensors.RSSI.Max;
    // }

    // data.Sensors.CO2.Value = Math.floor(map(Math.random(), 0, 1, 450, 550));
    // data.Sensors.Humidity.Value = Math.floor(map(Math.random(), 0, 1, 35, 45));
    // data.Sensors.Pressure.Value = Math.floor(map(Math.random(), 0, 1, 1000, 1015));
    // data.Sensors.Temperature.Value = Math.floor(map(Math.random(), 0, 1, data.temperatuurMin, data.temperatuurMax));

    draw();

    const buf = canvas.toBuffer()
    fs.writeFileSync(__dirname + '/output/overlay.png', buf)
    setTimeout(updateFrame, 1000)
  };

  updateFrame();

};

const map = (value, x1, y1, x2, y2) => Math.max(x2, Math.min(y2, (value - x1) * (y2 - x2) / (y1 - x1) + x2));

const draw = () => {
  ctx.clearRect(0, 0, width, height);

  // ctx.drawImage(testBeeldImg, 0, 0);
  ctx.drawImage(templateImg, 0, 0);

  drawVotes(data.RoverInput.VotesLeft, data.RoverInput.VotesRight, data.RoverInput.VotesForward);
  drawBatterij(data.Sensors.Battery.Value, data.Sensors.Battery.Min, data.Sensors.Battery.Max);
  drawWifi(data.Sensors.RSSI.Value, data.Sensors.RSSI.Min, data.Sensors.RSSI.Max);
  drawVerplaatsing(data.RoverInput.RemainingVotingTime, data.RoverInput.TotalVotingTime);
  drawCO2(data.Sensors.CO2.Value, data.Sensors.CO2.Min, data.Sensors.CO2.Max);
  drawLuchtvochtigheid(data.Sensors.Humidity.Value, data.Sensors.Humidity.Min, data.Sensors.Humidity.Max);
  drawLuchtdruk(data.Sensors.Pressure.Value, data.Sensors.Pressure.Min, data.Sensors.Pressure.Max);
  drawTemperatuur(data.Sensors.Temperature.Value, data.Sensors.Temperature.Min, data.Sensors.Temperature.Max);
};

const drawVotes = (left, right, up) => {
  let direction = 'up';
  const sorted = [left, right, up].sort().reverse();

  if (up === sorted[0]) {
    direction = 'up';
  } else if (left === sorted[0]) {
    direction = 'left';
  } else if (right === sorted[0]) {
    direction = 'right';
  }

  const leftImg = (direction === 'left') ? arrowLeftImg[1] : arrowLeftImg[0];
  const rightImg = (direction === 'right') ? arrowRightImg[1] : arrowRightImg[0];
  const upImg = (direction === 'up') ? arrowUpImg[1] : arrowUpImg[0];

  ctx.save();
  ctx.drawImage(leftImg, 428, 642);
  ctx.drawImage(upImg, 476, 620);
  ctx.drawImage(rightImg, 523, 642);

  let textSize;

  ctx.font = 'bold 12px Roboto Condensed';
  ctx.fillStyle = (direction === 'left') ? COLORS.BLUE : 'white';
  textSize = ctx.measureText(`${left}`);
  ctx.fillText(`${left}`, 449 - textSize.width / 2, 675);

  ctx.fillStyle = (direction === 'right') ? COLORS.BLUE : 'white';
  textSize = ctx.measureText(`${right}`);
  ctx.fillText(`${right}`, 544 - textSize.width / 2, 675);

  ctx.fillStyle = (direction === 'up') ? COLORS.BLUE : 'white';
  textSize = ctx.measureText(`${up}`);
  ctx.fillText(`${up}`, 497 - textSize.width / 2, 653);

  ctx.restore();
};

const drawBatterij = (value, min, max) => {
  const iconIndex = Math.round(map(value, min, max, 0, batteryImg.length-1));

  ctx.save();

  ctx.drawImage(batteryImg[iconIndex], 675, 625);
  ctx.font = 'bold 14px Roboto Condensed';
  ctx.fillStyle = 'white';

  const textSize = ctx.measureText(`${value}%`);

  ctx.fillText(`${value}%`, 695 - (textSize.width / 2), 665);
  
  ctx.restore();
};

const drawWifi = (value, min, max) => {
  const iconIndex = Math.round(map(value, min, max, 0, wifiImg.length-1));

  ctx.save();

  ctx.drawImage(wifiImg[iconIndex], 750, 625);
  ctx.font = 'bold 14px Roboto Condensed';
  ctx.fillStyle = 'white';

  const textSize = ctx.measureText(`${value}%`);

  ctx.fillText(`${value}%`, 770 - (textSize.width / 2), 665);
  
  ctx.restore();
};

const drawVerplaatsing = (secondsLeft, totalSeconds) => {
  ctx.save();

  ctx.font = 'bold 20px Roboto Condensed';
  ctx.fillStyle = COLORS.YELLOW;
  ctx.fillText(`${secondsLeft}s`, 240, 650);

  // rectangles
  ctx.fillStyle = COLORS.YELLOW;
  ctx.shadowColor = COLORS.YELLOW;
  ctx.shadowBlur = 3;

  const numBlocksFull = 15;
  const offsetX = 242;
  const numBlocksToDraw = numBlocksFull - Math.floor((secondsLeft / totalSeconds) * numBlocksFull)

  for(let i = 0; i < numBlocksToDraw; i++) {
    ctx.fillRect(offsetX + i * 8, 659, 6, 12);
  }

  ctx.restore();
};

const drawCO2 = (value, min, max) => {
  drawDonut(907, 613, map(value, min, max, 0, 360));

  ctx.save();
  ctx.font = 'bold 14px Roboto Condensed';
  ctx.fillStyle = 'white';
  const textSize = ctx.measureText(`${value}PPM`);
  ctx.fillText(`${value}PPM`, 932 - textSize.width, 675);
  ctx.restore();
};

const drawLuchtvochtigheid = (value, min, max) => {
  drawDonut(1018, 613, map(value, min, max, 0, 360));

  ctx.save();
  ctx.font = 'bold 14px Roboto Condensed';
  ctx.fillStyle = 'white';
  const textSize = ctx.measureText(`${value}%`);
  ctx.fillText(`${value}%`, 1032 - textSize.width, 675);
  ctx.restore();
};

const drawLuchtdruk = (value, min, max) => {
  drawDonut(1129, 613, map(value, min, max, 0, 360));

  ctx.save();
  ctx.font = 'bold 14px Roboto Condensed';
  ctx.fillStyle = 'white';
  const textSize = ctx.measureText(`${value}kPa`);
  ctx.fillText(`${value}kPa`, 1153 - textSize.width, 675);
  ctx.restore();
};

const drawTemperatuur = (value, min, max) => {
  const numBlokjes = Math.floor(map(value, min, max, 0, 8));

  ctx.save();

  ctx.font = 'bold 14px Roboto Condensed';
  ctx.fillStyle = 'white';
  const textSize = ctx.measureText(`${value}°C`);
  ctx.fillText(`${value}°C`, 1222 - textSize.width / 2, 675);

  ctx.fillStyle = COLORS.YELLOW;
  ctx.shadowColor = COLORS.YELLOW;
  ctx.shadowBlur = 3;

  const offsetX = 1216;
  const offsetY = 647;
  for(let i = 0; i < numBlokjes; i++) {
    ctx.fillRect(offsetX, offsetY - (i * 8), 12, 6);
  }

  ctx.restore();
};

const drawDonut = (offsetX, offsetY, valueAngleDeg) => {
  ctx.save();

  const radius = 40;
  const donutWidth = 8;
  const innerRadius = radius - donutWidth;

  let currentAngleDeg = 0;
  let currentAngleRad = Math.PI * 1.5 - currentAngleDeg * DEG_TO_RAD;
  ctx.beginPath();
  ctx.moveTo(offsetX + (Math.cos(currentAngleRad) * radius), offsetY + (Math.sin(currentAngleRad) * radius));
  for (currentAngleDeg = 0; currentAngleDeg < valueAngleDeg; currentAngleDeg++) {
    currentAngleRad = Math.PI * 1.5 - currentAngleDeg * DEG_TO_RAD;
    ctx.lineTo(offsetX + (Math.cos(currentAngleRad) * radius), offsetY + (Math.sin(currentAngleRad) * radius));
  }
  for (currentAngleDeg--; currentAngleDeg >= 0; currentAngleDeg--) {
    currentAngleRad = Math.PI * 1.5 - currentAngleDeg * DEG_TO_RAD;
    ctx.lineTo(offsetX + (Math.cos(currentAngleRad) * innerRadius), offsetY + (Math.sin(currentAngleRad) * innerRadius));
  }

  ctx.closePath();
  ctx.fillStyle = COLORS.YELLOW;
  ctx.shadowColor = COLORS.YELLOW;
  ctx.shadowBlur = 3;
  ctx.fill();

  ctx.restore();
};

init();


// let templateImg;

// loadImage('assets/template.png').then(o => {
//   templateImg = o
  
//   const updateFrame = () => {
//     ctx.clearRect(0, 0, 1280, 720)

//     ctx.drawImage(templateImg, 0, 0)

//     const timeString = new Date().toISOString();
//     ctx.font = '30px Impact'
//     ctx.fillText(timeString, 50, 100)
  
//     // Draw line under text
//     const text = ctx.measureText(timeString)
//     ctx.strokeStyle = 'rgba(0,0,0,0.5)'
//     ctx.beginPath()
//     ctx.lineTo(50, 102)
//     ctx.lineTo(50 + text.width, 102)
//     ctx.stroke()
  
//     const buf = canvas.toBuffer()
//     fs.writeFileSync(__dirname + '/output/overlay.png', buf)
//     setTimeout(updateFrame, 1000)
//   };
  
//   updateFrame();
// })