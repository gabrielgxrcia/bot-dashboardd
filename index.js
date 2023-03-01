const express = require('express')
const https = require('https')
const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const { Client, GatewayIntentBits, Partials } = require('discord.js')
const DiscordOauth2 = require('discord-oauth2')
const axios = require('axios')
const dotenv = require('dotenv')
const ejs = require('ejs')
const session = require('express-session')
const bodyParser = require('body-parser')

dotenv.config()
const sessionSecret =
  process.env.SESSION_SECRET || 'ASgwi-hE5W6k1R7bC8Q3zTtYgAaj2xL_'
const discordAPIToken = process.env.DISCORD_API_TOKEN

const app = express()

app.set('view engine', 'ejs')
app.set('js', 'application/javascript')
app.set('html', 'text/html')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
)

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [
    Partials.Message,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.User,
    Partials.Channel,
  ],
})

const oauth = new DiscordOauth2({
  clientId: '1076701364115214458',
  clientSecret: 'ASgwi-hE5W6k1R7bC8Q3zTtYgAaj2xL_',
  redirectUri: 'https://localhost/auth/discord/callback',
})

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  const redirectUri = 'https://localhost/auth/discord/callback'
  const scopes = ['identify', 'guilds', 'connections']
  const authUrl = oauth.generateAuthUrl({
    scope: scopes.join(' '),
    prompt: 'consent',
    state: 'some-state',
  })
  res.redirect(authUrl)
})

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code
  console.log(code)
  try {
    const token = await oauth.tokenRequest({
      code,
      scope: 'identify guilds',
      grantType: 'authorization_code',
    })
    console.log(token)
    req.session.token = token
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.redirect('/login')
  }
})

app.get('/dashboard', async (req, res) => {
  try {
    if (!req.session.token) {
      return res.redirect('/login')
    }
    const { access_token } = req.session.token
    const fullUser = await oauth.getUser(access_token, {
      scopes: ['identify'],
      loadGuilds: true,
    })
    const { username, discriminator, avatar } = fullUser
    const avatarURL = `https://cdn.discordapp.com/avatars/${fullUser.id}/${avatar}.png`
    const user = { username, discriminator, avatarURL }
    const guilds = await oauth.getUserGuilds(access_token)
    const guildsWithIconURL = await Promise.all(
      guilds.map(async guild => {
        guild.iconURL = guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null
        return guild
      })
    )
    res.render('dashboard', {
      user,
      guilds: guildsWithIconURL,
    })
  } catch (err) {
    console.error(err)
    res.redirect('/login')
  }
})

const webhookUrl =
  'https://discord.com/api/webhooks/1079994229461356555/kmCsf-0fX2Rsg3UZHSa4UIDNy2617MNmohxoEqua1xORG2gqZuXi2XIKLwLzNBpbmDoQ'

app.post('/message', async (req, res) => {
  try {
    const { message } = req.body
    const { access_token } = req.session.token
    const fullUser = await oauth.getUser(access_token, {
      scopes: ['identify'],
    })
    const { username, avatar } = fullUser
    const avatarURL = `https://cdn.discordapp.com/avatars/${fullUser.id}/${avatar}.png`
    const payload = {
      username,
      avatar_url: avatarURL,
      content: message,
    }
    await axios.post(webhookUrl, payload)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.redirect('/login')
  }
})

client.on('ready', () => {
  console.log(`Você se logou em: ${client.user.tag}`)
})

client.login(discordAPIToken)

const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}

https.createServer(options, app).listen(443, () => {
  console.log('Discord está online na porta: 443')
})
