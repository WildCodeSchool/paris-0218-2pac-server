const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('./routes/users.js')
const articlesRouter = require('./routes/articles.js')
const documentsRouter = require('./routes/documents.js')
const subscribersRouter = require('./routes/subscribers.js')
const staticsRouter = require('./routes/statics.js')
const bodyParser = require('body-parser')

const db = require(process.env.MOCKS ? './db/db-mocks.js' : './db/db-sql.js')
const jwtSecret = process.env.JWT_SECRET || console.info('missing JWT_SECRET env variable') || 'SECRET'
const port = process.env.PORT || console.info('missing PORT env variable -> fallback to 5000') || 5000

const app = express()

// MIDDLEWARES

const mediasFolderPath = path.join(__dirname, '../public')

app.use('/medias', express.static(mediasFolderPath))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

// Logger middleware
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

// Authentication (with JWT) middleware
app.use((req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) { return next() }

  const [ key, token ] = authorization.split(' ')

  if (key !== 'JWT' || !token) { return next() }

  const decodedUser = jwt.verify(token, jwtSecret)

  req.user = decodedUser

  console.log('authenticated as', req.user)

  next()
})

// Routes

app.get('/', (req, res) => {
  res.send('Vous êtes connecté au serveur ;-)')
})

app.get('/whoami', (req, res, next) => {
  res.json({ user: req.user })
})

app.post('/signin', async (req, res, next) => {
  const { username, password } = req.body

  const user = await db.getUsers.byUsername(username).catch(console.log)

  if (!user) { return next(Error('User not found')) }

  if (!(await bcrypt.compare(password, user.password))) { return next(Error('Wrong password')) }

  const userSignature = { id: user.id, username: user.username, isAdmin: user.isAdmin }

  const token = jwt.sign(userSignature, jwtSecret)

  res.json({ user: userSignature, token })
})

app.use('/', usersRouter, articlesRouter, documentsRouter, subscribersRouter, staticsRouter)

app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Errors handling
app.use((err, req, res, next) => {
  if (err) {
    res.json({ error: err.message })
    return console.error(err)
  }

  next()
})

app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

module.exports = app
