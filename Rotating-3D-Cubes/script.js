const state = {
  angle: 0,
  playing: false,
  intervalId: null
}

const cubes = document.querySelectorAll('.cube')
const controls = document.querySelector('.viewpoint')

const setRotation = angle => {
  cubes.forEach(cube => {
    cube.style.transform = `rotateY(${angle}deg)`
  })
}

const toggleIcon = () => {
  const icon = document.querySelector('.play-pause i')
  icon.classList.toggle('fa-play')
  icon.classList.toggle('fa-pause')
}

const startAutoRotate = () => {
  state.intervalId = setInterval(() => {
    state.angle -= 90
    setRotation(state.angle)
  }, 3000)
}

const stopAutoRotate = () => {
  clearInterval(state.intervalId)
  state.intervalId = null
}

const togglePlayPause = () => {
  state.playing = !state.playing
  toggleIcon()
  state.playing ? startAutoRotate() : stopAutoRotate()
}

const nudge = amount => {
  state.angle += amount
  setRotation(state.angle)
}

const rotateStep = amount => {
  state.angle += amount
  setRotation(state.angle)
  if (state.playing) togglePlayPause()
}

controls.addEventListener('click', e => {
  if (e.target.closest('.left-arrow')) rotateStep(90)
  if (e.target.closest('.right-arrow')) rotateStep(-90)
  if (e.target.closest('.play-pause')) togglePlayPause()
})

controls.addEventListener('mouseover', e => {
  if (e.target.closest('.left-arrow')) nudge(25)
  if (e.target.closest('.right-arrow')) nudge(-25)
})

controls.addEventListener('mouseout', e => {
  if (e.target.closest('.left-arrow')) nudge(-25)
  if (e.target.closest('.right-arrow')) nudge(25)
})
