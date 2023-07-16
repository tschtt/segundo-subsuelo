/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d')

const header = document.querySelector('.header')
const logo = document.querySelector('.logo')

// Helpers

function map(n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

// Code

const state = {
  squares: [],
  mouse: {
    pos_x: -100,
    pos_y: -100,
    pressed: false,
    click: false,
  }
}

function on_init () {
  on_draw()
}

function on_draw () {
  // resize canvas
  if(canvas.width !== canvas.offsetWidth) canvas.width = canvas.offsetWidth;
  if(canvas.height !== canvas.offsetHeight) canvas.height = canvas.offsetHeight;

  const expand_rate = 1;
  const logo_width = logo.offsetWidth
  const header_height = header.offsetHeight

  ctx.beginPath();
  ctx.lineWidth = 10
  ctx.strokeStyle = 'hsla(120, 73%, 47%, .5)'
  ctx.fillStyle = 'hsla(120, 73%, 47%, .5)'
  ctx.roundRect(
    (canvas.width / 2) - (logo_width / 2), 
    (header_height / 2) - (logo_width / 2),
    logo_width,
    logo_width,
    1000
  )
  ctx.stroke()
    
  // expand outwards
  ctx.drawImage(
    canvas, 
    (expand_rate / 2) * -1,
    (expand_rate / 2) * -1,
    canvas.width + expand_rate,
    canvas.height + expand_rate,
  )
  
  // blur & hue rotation
  ctx.filter = "blur(1px) hue-rotate(.5deg)";

  // limit framerate to ~30fps
  setTimeout(() => {
    requestAnimationFrame(on_draw)
  }, 33);
}

window.addEventListener('load', on_init)