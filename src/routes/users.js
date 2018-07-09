const express = require('express')
const router = express.Router()
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

router.get('/users', (req, res, next) => {
  db.getUsers()
    .then(users => res.json(users))
    .catch(next)
})

router.post('/users', (req, res, next) => {
  const user = req.body

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
