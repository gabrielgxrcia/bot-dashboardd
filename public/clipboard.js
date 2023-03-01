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

const emojiBtn = document.querySelector('.emoji-btn')
const emojiList = document.getElementById('emoji-list')
emojiBtn.addEventListener('click', showEmojiList)

function showEmojiList() {
  if (!emojiList.innerHTML) {
    twemoji.parse(emojiList)
    const emojis = [
      '😀',
      '😁',
      '😂',
      '🤣',
      '😃',
      '😄',
      '😅',
      '😆',
      '😉',
      '😊',
      '😋',
      '😎',
      '😍',
      '😘',
      '😗',
      '😙',
      '😚',
      '🙂',
      '🤗',
      '🤔',
      '😐',
      '😑',
      '😶',
      '🙄',
      '😏',
      '😣',
      '😥',
      '😮',
      '😯',
      '😪',
      '😫',
      '😴',
      '😌',
      '😛',
      '😜',
      '😝',
      '🤤',
      '😒',
      '😓',
      '😔',
      '😕',
      '🙃',
      '🤑',
      '😲',
      '☹️',
      '🙁',
      '😖',
      '😞',
      '😟',
      '😤',
      '😢',
      '😭',
      '😦',
      '😧',
      '😨',
      '😩',
      '🤯',
      '😬',
      '😰',
      '😱',
      '🥵',
      '🥶',
      '😳',
      '🤪',
      '😵',
      '🥴',
      '😠',
      '😡',
      '🤬',
      '😷',
      '🤒',
      '🤕',
      '🤢',
      '🤮',
      '🥳',
      '🥴',
      '🥺',
      '🤠',
      '🤡',
      '👿',
      '💀',
      '👻',
      '👽',
      '🤖',
      '👍',
      '👎',
      '👊',
      '👋',
      '💩',
      '🔥',
      '🎉',
    ]
    emojis.forEach(emoji => {
      emojiList.innerHTML += `<span onclick="addEmojiToInput('${emoji}')">${emoji}</span>`
    })
  }
  emojiList.style.display = 'block'
}

document.addEventListener('click', event => {
  if (
    !event.target.closest('#emoji-list') &&
    !event.target.closest('.emoji-btn')
  ) {
    emojiList.style.display = 'none'
  }
})

function addEmojiToInput(emoji) {
  const messageInput = document.getElementById('message-input')
  messageInput.value += emoji
}

const attachmentBtn = document.getElementById('attachment-btn')
const attachmentInput = document.getElementById('attachment-input')
const messageInput = document.getElementById('message-input')
const form = document.querySelector('form')

attachmentBtn.addEventListener('click', () => {
  attachmentInput.click()
})

attachmentInput.addEventListener('change', event => {
  const file = event.target.files[0]

  if (file.type.startsWith('image/') || file.type === 'text/plain') {
    messageInput.value = file.name
    form.append('attachment', file, file.name)
  } else {
    alert('Invalid file type. Only image and text files are allowed.')
  }
})

messageInput.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    event.preventDefault()
    form.submit()
  }
})

form.addEventListener('submit', event => {
  event.preventDefault()

  const message = messageInput.value
  const formData = new FormData(form)

  formData.set('message', message)

  console.log(formData)

  fetch('/message', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => console.log(data))
})

const micToggle = document.getElementById('micToggle')
const micLine = micToggle.querySelector('.mic-line')
const headphoneIcon = document.querySelector('#headphoneToggle')
const redLine = document.querySelector('.headphone-line line')

micToggle.addEventListener('click', () => {
  micToggle.classList.toggle('muted')
  micLine.style.visibility = micToggle.classList.contains('muted')
    ? 'visible'
    : 'hidden'
})

headphoneIcon.addEventListener('click', function () {
  if (redLine.style.display === 'none') {
    redLine.style.display = 'block'
  } else {
    redLine.style.display = 'none'
  }
})
