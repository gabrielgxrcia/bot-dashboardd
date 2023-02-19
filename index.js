const express = require('express')
const https = require('https')
const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const DiscordOauth2 = require('discord-oauth2')
const dotenv = require('dotenv')
const { Client, GatewayIntentBits, Partials } = require('discord.js')
const ejs = require('ejs')
const session = require('express-session')

dotenv.config()

const app = express()
const sessionSecret =
  process.env.SESSION_SECRET || '1Z6r9an8v7oXBfT2_bqK3ausxJkaboFW'
const token = process.env.DISCORD_API_TOKEN

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
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
  clientSecret: '1Z6r9an8v7oXBfT2_bqK3ausxJkaboFW',
  redirectUri: 'https://localhost/auth/discord/callback',
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  const redirectUri = 'https://localhost/auth/discord/callback'
  const scope = 'identify guilds'
  const authUrl = oauth.generateAuthUrl({
    scope,
    redirectUri,
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
  if (!req.session.token) {
    res.redirect('/login')
    return
  }
  try {
    const user = await oauth.getUser(req.session.token.access_token)
    const guilds = await oauth.getUserGuilds(req.session.token.access_token)
    res.render('dashboard', {
      user,
      guilds,
    })
  } catch (err) {
    console.error(err)
    res.redirect('/login')
  }
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.login(token)

const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}

https.createServer(options, app).listen(443, () => {
  console.log('Server started on port 443')
})
