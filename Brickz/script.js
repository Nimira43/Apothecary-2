const modalBtn = document.getElementById('modal-btn')
const closeBtn = document.getElementById('close-btn')
const modal = document.getElementById('modal')

modalBtn.addEventListener('click', () => modal.classList.add('show'))
closeBtn.addEventListener('click', () => modal.classList.remove('show'))