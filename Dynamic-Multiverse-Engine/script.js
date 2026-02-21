const cosmos = document.querySelector('.cosmos')

function random(min, max) {
  return Math.random() * (max - min) + min
}

function spawnUniverse() {
  const uni = document.createElement('div')
  uni.className = 'universe'

  const size = random(40, 160)
  uni.style.width = size + 'px'
  uni.style.height = size + 'px'

  uni.style.left = random(0, cosmos.clientWidth - size) + 'px'
  uni.style.top = random(0, cosmos.clientHeight - size) + 'px'

  cosmos.appendChild(uni)

  const lifespan = random(3000, 9000)
  setTimeout(() => explodeUniverse(uni), lifespan)
}

function explodeUniverse(uni) {
  const rect = uni.getBoundingClientRect()

  const boom = document.createElement('div')
  boom.className = 'explosion'
  boom.style.width = rect.width + 'px'
  boom.style.height = rect.height + 'px'
  boom.style.left = rect.left + 'px'
  boom.style.top = rect.top + 'px'

  cosmos.appendChild(boom)
  uni.remove()

  setTimeout(() => boom.remove(), 1500)

  if (Math.random() < 0.3) spawnWormhole(rect.left, rect.top)
}

function spawnWormhole(x, y) {
  const worm = document.createElement('div')
  worm.className = 'wormhole'
  worm.style.left = x + 'px'
  worm.style.top = y + 'px'

  cosmos.appendChild(worm)

  setTimeout(() => worm.remove(), 6000)
}

function spawnLightning() {
  const bolt = document.createElement('div')
  bolt.className = 'lightning'
  bolt.style.left = random(0, cosmos.clientWidth - 400) + 'px'
  bolt.style.top = random(0, cosmos.clientHeight - 400) + 'px'

  cosmos.appendChild(bolt)

  setTimeout(() => bolt.remove(), 2000)
}

window.onload = () => {
  setInterval(spawnUniverse, 600)
  setInterval(spawnLightning, 5000)
}
