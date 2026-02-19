// TWO.js setup
const two = new Two({
  fullscreen: true,
  autostart: true
}).appendTo(document.body)

// Game state
let gameOver = false
let win = false

// Score
let score = 0
let bestScore = 0

const scoreEl = document.getElementById('score')
const bestEl = document.getElementById('best')

// Player
const player = two.makeRectangle(two.width / 2, two.height - 50, 30, 30)
player.fill = '#4af'
player.noStroke()

let vy = 0
let onGround = false

// Ceiling Tiger
const tiger = two.makeRectangle(two.width / 2, 50, 120, 40)
tiger.fill = '#ff8800'
tiger.noStroke()

// Gem
const gem = two.makeCircle(two.width / 2, 120, 15)
gem.fill = '#0f0'
gem.noStroke()

// Fireballs
const fireballs = []

function spawnFireball() {
  if (gameOver || win) return
  const fb = two.makeCircle(Math.random() * two.width, 80, 10)
  fb.fill = '#f33'
  fb.noStroke()
  fb.vy = 3 + Math.random() * 2
  fireballs.push(fb)
}

setInterval(spawnFireball, 1200)

// Input
const keys = {}
window.addEventListener('keydown', e => keys[e.code] = true)
window.addEventListener('keyup', e => keys[e.code] = false)

// Platforms
let platforms = []

function generatePlatforms() {
  // Remove old platforms
  platforms.forEach(p => two.remove(p))
  platforms = []

  // Ground
  platforms.push(two.makeRectangle(two.width / 2, two.height - 20, two.width, 40))

  const totalPlatforms = 22
  const verticalGap = (two.height - 240) / totalPlatforms

  let y = two.height - 120

  for (let i = 0; i < totalPlatforms; i++) {
    let x

    // Three guaranteed climb paths
    if (i % 4 === 0) x = two.width * 0.25
    else if (i % 4 === 2) x = two.width * 0.75
    else x = two.width * 0.5 + (Math.random() * 300 - 150)

    const width = 140 + Math.random() * 160

    const p = two.makeRectangle(x, y, width, 20)
    p.fill = '#333'
    p.noStroke()

    // 35% chance to move
    p.moving = Math.random() < 0.35
    p.speed = (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random() * 1.4)

    platforms.push(p)
    y -= verticalGap
  }

  // Final platform under tiger
  const final = two.makeRectangle(two.width / 2, 180, 260, 20)
  final.fill = '#333'
  final.noStroke()
  final.moving = false
  platforms.push(final)
}

generatePlatforms()

// Reset game
function resetGame() {
  gameOver = false
  win = false

  player.translation.x = two.width / 2
  player.translation.y = two.height - 50
  vy = 0

  fireballs.forEach(fb => two.remove(fb))
  fireballs.length = 0

  score = 0

  generatePlatforms()
}

// Game loop
two.bind('update', () => {
  if (gameOver || win) return

  // Tiger patrol
  tiger.translation.x += 1.2
  if (tiger.translation.x > two.width + 80) tiger.translation.x = -80

  // Score increases as player climbs
  const heightScore = Math.floor((two.height - player.translation.y) / 10)
  score = Math.max(score, heightScore)

  scoreEl.textContent = `Score: ${score}`
  bestEl.textContent = `Best: ${bestScore}`

  // Gravity
  vy += 0.4
  player.translation.y += vy

  // Horizontal movement
  if (keys['ArrowLeft']) player.translation.x -= 3
  if (keys['ArrowRight']) player.translation.x += 3

  // Keep player in bounds
  if (player.translation.x < 15) player.translation.x = 15
  if (player.translation.x > two.width - 15) player.translation.x = two.width - 15

  // Platform movement + collision
  onGround = false
  const pw = 30
  const ph = 30

  platforms.forEach(p => {
    // Move platform
    if (p.moving) {
      p.translation.x += p.speed
      if (p.translation.x < p.width / 2 || p.translation.x > two.width - p.width / 2) {
        p.speed *= -1
      }
    }

    const px = player.translation.x
    const py = player.translation.y

    const bx = p.translation.x
    const by = p.translation.y
    const bw = p.width
    const bh = p.height

    const hitHoriz =
      px + pw / 2 > bx - bw / 2 &&
      px - pw / 2 < bx + bw / 2

    const hitVert =
      py + ph / 2 > by - bh / 2 &&
      py + ph / 2 < by

    if (hitHoriz && hitVert && vy > 0) {
      player.translation.y = by - bh / 2 - ph / 2
      vy = 0
      onGround = true
    }
  })

  // Jump
  if (keys['Space'] && onGround) {
    vy = -12
  }

  // Fireballs
  fireballs.forEach(fb => {
    fb.translation.y += fb.vy

    if (fb.translation.y > two.height + 20) {
      fb.translation.y = 80
      fb.translation.x = Math.random() * two.width
    }

    const dx = fb.translation.x - player.translation.x
    const dy = fb.translation.y - player.translation.y
    if (Math.hypot(dx, dy) < 25) {
      gameOver = true
      bestScore = Math.max(bestScore, score)
      setTimeout(resetGame, 800)
    }
  })

  // Gem collision
  const dx = gem.translation.x - player.translation.x
  const dy = gem.translation.y - player.translation.y
  if (Math.hypot(dx, dy) < 30) {
    win = true
    bestScore = Math.max(bestScore, score)
    setTimeout(resetGame, 1200)
  }
})
