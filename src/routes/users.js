const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const { authRequired } = require('../middlewares.js')
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

const hideUserPassword = ({ password, ...user }) => user
const hideUsersPasswords = users => users.map(hideUserPassword)

router.get('/users', authRequired.asAdmin, (req, res, next) => {
  db.getUsers()
    .then(hideUsersPasswords)
    .then(users => res.json(users))
    .catch(next)
})

router.post('/users', authRequired.asAdmin, async (req, res, next) => {
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

router.delete('/users/:id', authRequired.asAdmin, (req, res, next) => {
  const userId = req.params.id

  db.deleteUser(userId)
    .then(() => res.json('ok'))
    .catch(next)
})

module.exports = router
