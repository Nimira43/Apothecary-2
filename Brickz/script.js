const modalBtn = document.getElementById('modal-btn')
const closeBtn = document.getElementById('close-btn')
const modal = document.getElementById('modal')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let score = 0
let lives = 5
let gameOver = false

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

function drawBall() {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
  ctx.fillStyle = ball.visible ? '#fffdfa' : 'transparent'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
  ctx.fillStyle = paddle.visible ? '#fffdfa' : 'transparent'
  ctx.fill()
  ctx.closePath()
}

function drawScore() {
  ctx.font = '20px Arial'
  ctx.fillStyle = '#fffdfa'
  ctx.fillText(`Score: ${score}`, canvas.width - 120, 30)
}

function drawLives() {
  ctx.font = '20px Arial'
  ctx.fillStyle = '#fffdfa'
  ctx.fillText(`Lives: ${lives}`, 20, 30)
}

function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath()
      ctx.rect(brick.x, brick.y, brick.w, brick.h)
      ctx.fillStyle = brick.visible ? '#fffdfa' : 'transparent'
      ctx.fill()
      ctx.closePath()
    })
  })
}

function movePaddle() {
  paddle.x += paddle.dx

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w
  }

  if (paddle.x < 0) {
    paddle.x = 0
  }
}

function moveBall() {
  if (gameOver) return

  ball.x += ball.dx
  ball.y += ball.dy

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1
  }

  if (ball.y - ball.size < 0) {
    ball.dy *= -1
  }

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed
  }

  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1
          brick.visible = false
          increaseScore()
        }
      }
    })
  })

  if (ball.y + ball.size > canvas.height) {
    loseLife()
  }
}

function loseLife() {
  lives--

  if (lives <= 0) {
    gameOver = true
    ball.visible = false
    paddle.visible = false
    return
  }

  resetBall()
}

function resetBall() {
  ball.x = canvas.width / 2
  ball.y = canvas.height / 2
  ball.dx = 4
  ball.dy = -4
}

function increaseScore() {
  score++

  if (score % (brickRowCount * brickColumnCount) === 0) {
    ball.visible = false
    paddle.visible = false

    setTimeout(() => {
      showAllBricks()
      score = 0
      resetBall()
      ball.visible = true
      paddle.visible = true
    }, delay)
  }
}

function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true))
  })
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawBall()
  drawPaddle()
  drawScore()
  drawLives()
  drawBricks()

  if (gameOver) {
    ctx.font = '50px Protest Revolution'
    ctx.fillStyle = '#fffdfa'
    ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2)
    ctx.font = '20px Arial'
    ctx.fillText('Press SPACE to restart', canvas.width / 2 - 120, canvas.height / 2 + 40)
  }
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

  if (e.code === 'Space' && gameOver) {
    lives = 5
    score = 0
    gameOver = false
    showAllBricks()
    resetBall()
    ball.visible = true
    paddle.visible = true
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
