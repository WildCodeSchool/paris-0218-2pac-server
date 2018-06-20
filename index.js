const express = require('express')
const app = express()
const router = express.Router()
const authRouter = require('./routes/auth/auth.js')

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

module.exports = router
