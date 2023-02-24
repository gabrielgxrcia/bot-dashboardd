const userinfoEl = document.querySelector('.userinfo')
const usernameEl = document.querySelector('.username')
const discriminatorEl = document.querySelector('.userinfo .discriminator')

userinfoEl.addEventListener('click', copyToClipboard)

function copyToClipboard() {
  const username = document.querySelector('.username').innerText
  const discriminator = document.querySelector(
    '.userinfo .discriminator'
  ).innerText
  const textToCopy = username + '#' + discriminator

  const input = document.createElement('input')
  input.value = textToCopy
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)

  alert('Copiado para a área de transferência: ' + textToCopy)
}
