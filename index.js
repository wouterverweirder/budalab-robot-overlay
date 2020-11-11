const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(1280, 720)
const ctx = canvas.getContext('2d')

let templateImg;

loadImage('assets/template.png').then(o => {
  templateImg = o
  
  const updateFrame = () => {
    ctx.clearRect(0, 0, 1280, 720)

    ctx.drawImage(templateImg, 0, 0)

    const timeString = new Date().toISOString();
    ctx.font = '30px Impact'
    ctx.fillText(timeString, 50, 100)
  
    // Draw line under text
    const text = ctx.measureText(timeString)
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.beginPath()
    ctx.lineTo(50, 102)
    ctx.lineTo(50 + text.width, 102)
    ctx.stroke()
  
    const buf = canvas.toBuffer()
    fs.writeFileSync(__dirname + '/output/overlay.png', buf)
    setTimeout(updateFrame, 1000)
  };
  
  updateFrame();
})