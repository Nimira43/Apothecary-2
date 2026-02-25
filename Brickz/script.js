const modalBtn = document.getElementById('modal-btn')
const closeBtn = document.getElementById('close-btn')
const modal = document.getElementById('modal')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let score = 0

const brickRowCount = 9
const brickColumnCount = 5
const delay = 500

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true
}

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true
}

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

const bricks = []
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = []
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY
    bricks[i][j] = { x, y, ...brickInfo }
  }
}

function drawBall() { }

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
  ctx.fillStyle = paddle.visible ? '#fffdfa' : 'transparent'
  ctx.fill()
  ctx.closePath()
}

function drawScore() { }
function drawBricks() { }

function movePaddle() { 
  paddle.x += paddle.dx

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w
  }

  if (paddle.x < 0) {
    paddle.x = 0
  }
}

function moveBall() { }
function increaseScore() { }
function showAllBricks() { }

function draw() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawPaddle()
}

function update() { 
  movePaddle()
  moveBall()
  draw()
  requestAnimationFrame(update)
}

update()

function keyDown(e) { 
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed
  }
}
function keyUp(e) { 
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0
  }
}

document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)
modalBtn.addEventListener('click', () => modal.classList.add('show'))
closeBtn.addEventListener('click', () => modal.classList.remove('show'))