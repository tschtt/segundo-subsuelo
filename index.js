/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('.canvas');

/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d')

const state = {
  squares: [],
  mouse: {
    pos_x: -100,
    pos_y: -100,
    pressed: false,
  }
}

function on_init () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  on_draw()
}

function on_draw () {
  ctx.strokeStyle = 'hsla(120, 73%, 47%, .5)'
  
  ctx.fillStyle = 'hsla(0, 0%, 0%, .0018)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.filter = "blur(1px) hue-rotate(1deg)";

  ctx.drawImage(
    canvas, 
    -1, 
    -1, 
    canvas.width + 2,
    canvas.height + 2,
  )

  // ctx.filter = "";
  
  ctx.beginPath();
  
  ctx.fillStyle = 'hsla(120, 73%, 47%, .5)'
  ctx.roundRect(state.mouse.pos_x - 20, state.mouse.pos_y - 20, 40, 40, 100)
  
  // ctx.fillRect(0, 0, canvas.width, canvas.height)
    
  ctx.stroke()

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
  // state.squares.push({
  //   pos_x: event.pageX - canvas.offsetLeft,
  //   pos_y: event.pageY - canvas.offsetTop,
  // })
}

function on_mouse_up (event) {
  state.mouse.pressed = false
}

window.addEventListener('mousemove', on_mouse_move)
window.addEventListener('mousedown', on_mouse_down)
window.addEventListener('mouseup', on_mouse_up)

on_init()