const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

const prepareUser = user => ({
  id: user.id,
  createdAt: user.createdAt,
  username: user.username,
  isAdmin: Boolean(user.isAdmin)
})
const prepareUsers = users => users.map(prepareUser)

router.get('/users', (req, res, next) => {
  db.getUsers()
    .then(prepareUsers)
    .then(users => res.json(users))
    .catch(next)
})

router.post('/users', async (req, res, next) => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

  const user = {
    ...req.body,
    password: hashedPassword
  }

  db.newUser(user)
    .then(() => res.json('ok'))
    .catch(next)
})

router.delete('/users/:id', (req, res, next) => {
  const userId = req.params.id

  db.deleteUser(userId)
    .then(() => res.json('ok'))
    .catch(next)
})

module.exports = router
