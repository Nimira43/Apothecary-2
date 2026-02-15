import { quizQuestions } from './js/questions.js'

const startScreen = document.getElementById('start-screen')
const quizScreen = document.getElementById('quiz-screen')
const resultScreen = document.getElementById('result-screen')

const startButton = document.getElementById('start-btn')
const questionText = document.getElementById('question-text')
const answersContainer = document.getElementById('answers-container')

const currentQuestionSpan = document.getElementById('current-question')
const totalQuestionsSpan = document.getElementById('total-questions')
const scoreSpan = document.getElementById('score')

const finalScoreSpan = document.getElementById('final-score')
const maxScoreSpan = document.getElementById('max-score')
const resultMessage = document.getElementById('result-message')
const restartButton = document.getElementById('restart-btn')

const progressBar = document.getElementById('progress')

let currentQuestionIndex = 0
let score = 0
let answersDisabled = false

totalQuestionsSpan.textContent = quizQuestions.length
maxScoreSpan.textContent = quizQuestions.length

startButton.addEventListener('click', startQuiz)
restartButton.addEventListener('click', restartQuiz)

function startQuiz() {
  currentQuestionIndex = 0
  score = 0
  scoreSpan.textContent = 0

  startScreen.classList.remove('active')
  quizScreen.classList.add('active')

  showQuestions()
}

function showQuestions() {
  answersDisabled = false
  const currentQuestion = quizQuestions[currentQuestionIndex]

  currentQuestionSpan.textContent = currentQuestionIndex + 1
  questionText.textContent = currentQuestion.question

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100
  progressBar.style.width = progressPercent + '%'

  answersContainer.innerHTML = ''

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement('button')
    button.textContent = answer.text
    button.classList.add('answer-btn')

    if (answer.correct) {
      button.dataset.correct = 'true'
    }

    button.addEventListener('click', selectAnswer)
    answersContainer.appendChild(button)
  })
}

function selectAnswer(event) {
  if (answersDisabled) return
  answersDisabled = true

  const selectedButton = event.target
  const isCorrect = selectedButton.dataset.correct === 'true'

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === 'true') {
      button.classList.add('correct')
    } else if (button === selectedButton) {
      button.classList.add('incorrect')
    }
  })

  if (isCorrect) {
    score++
    scoreSpan.textContent = score
  }

  setTimeout(() => {
    currentQuestionIndex++
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestions()
    } else {
      showResults()
    }
  }, 900)
}

function showResults() {
  quizScreen.classList.remove('active')
  resultScreen.classList.add('active')

  finalScoreSpan.textContent = score

  const percentage = (score / quizQuestions.length) * 100

  if (percentage === 100) resultMessage.textContent = 'Perfect'
  else if (percentage >= 80) resultMessage.textContent = 'Impressive'
  else if (percentage >= 60) resultMessage.textContent = 'Not Bad'
  else if (percentage >= 40) resultMessage.textContent = 'Below Par'
  else resultMessage.textContent = 'Need to do better.'
}

function restartQuiz() {
  resultScreen.classList.remove('active')
  startScreen.classList.add('active')
}
