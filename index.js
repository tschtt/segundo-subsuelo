/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('.canvas');
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d')
/**
 * @type {HTMLImageElement}
 */
const logo = document.querySelector('.logo')


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
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  on_draw()
}

function on_draw () {
  // resize canvas
  if(canvas.width !== canvas.offsetWidth) canvas.width = canvas.offsetWidth;
  if(canvas.height !== canvas.offsetHeight) canvas.height = canvas.offsetHeight;

  const expand_rate = 1;
  
  // render circle
  ctx.beginPath();
  ctx.lineWidth = 3
  ctx.strokeStyle = 'hsla(120, 73%, 47%, .5)'
  ctx.fillStyle = 'hsla(120, 73%, 47%, .5)'
  ctx.roundRect(
    (canvas.width / 2) - (logo.width / 2), 
    (canvas.height / 2) - (logo.height / 2),
    logo.width, 
    logo.height, 
    1000
  )
  ctx.stroke()
  
  // expand canvas
  
  // expand outwards
  ctx.drawImage(
    canvas, 
    (expand_rate / 2) * -1,
    (expand_rate / 2) * -1,
    canvas.width + expand_rate,
    canvas.height + expand_rate,
  )

  // expand inwards
  // ctx.drawImage(
  //   canvas, 
  //   expand_rate / 2,
  //   expand_rate / 2,
  //   canvas.width - expand_rate,
  //   canvas.height - expand_rate,
  // )

  
  ctx.fillStyle = 'hsla(0, 0%, 0%, .005)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.filter = "blur(0.5px) hue-rotate(.5deg)";

  setTimeout(() => {
    requestAnimationFrame(on_draw)
  }, 33);
}

function on_mouse_move (event) {
  state.mouse.pos_x = event.pageX - canvas.offsetLeft
  state.mouse.pos_y = event.pageY - canvas.offsetTop
}

function on_mouse_down (event) {
  state.mouse.pressed = true
  state.mouse.click = true
}

function on_mouse_up (event) {
  state.mouse.pressed = false
}

window.addEventListener('mousemove', on_mouse_move)
window.addEventListener('mousedown', on_mouse_down)
window.addEventListener('mouseup', on_mouse_up)
window.addEventListener('load', on_init)