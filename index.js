const http = require('http')
const express = require('express')
const app = express()
const router = express.Router()
const mysql = require('mysql2/promise')
const db = require('./sql/db.js')
const authRouter = require('./routes/auth/auth.js')
const connection = require('./sql/db.js')

app.use('/auth', authRouter)

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

module.exports = router;
