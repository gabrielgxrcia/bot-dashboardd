const svg = document.querySelector('.addDirectMessages')
const tooltip = document.createElement('div')
tooltip.classList.add('tooltip')
tooltip.textContent = 'Create DM'

svg.addEventListener('mouseover', () => {
  tooltip.style.display = 'block'
})

svg.addEventListener('mouseout', () => {
  tooltip.style.display = 'none'
})

svg.addEventListener('mousemove', event => {
  tooltip.style.top = `${event.clientY + 10}px`
  tooltip.style.left = `${event.clientX + 10}px`
  tooltip.style.transform = 'translate(-150%, -150%)'
})

document.querySelector('.direct-msg').appendChild(tooltip)

const userinfoEl = document.querySelector('.userinfo')
const usernameEl = userinfoEl.querySelector('.username')
const discriminatorEl = userinfoEl.querySelector('.discriminator')

userinfoEl.addEventListener('click', copyToClipboard)

function copyToClipboard() {
  const username = usernameEl.innerText
  const discriminator = discriminatorEl.innerText
  const textToCopy = `${username}#${discriminator}`

  const input = document.createElement('input')
  input.value = textToCopy
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)

  alert(`Copiado para a área de transferência: ${textToCopy}`)
}
