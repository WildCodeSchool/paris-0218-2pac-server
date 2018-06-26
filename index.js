const express = require('express')
// const authRouter = require('./routes/auth/auth.js')
const articlesRouter = require('./routes/articles.js')
const documentsRouter = require('./routes/documents.js')
const bodyParser = require('body-parser')

const app = express()

// MIDDLEWARES

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use('/', articlesRouter)

app.get('/', (req, res) => {
  res.send('Vous êtes connecté au serveur ;-)')
})

app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.listen(1107, () => {
  console.log('listening on port 1107')
})

module.exports = app
