const express = require('express')
const router = express.Router()
const { authRequired } = require('../middlewares.js')
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

const prepareSubscriber = subscriber => ({
  ...subscriber,
  reuseableInfo: Boolean(subscriber.reuseableInfo)
})
const prepareSubscribers = subscribers => subscribers.map(prepareSubscriber)

router.get('/subscribers', authRequired.asAdmin, (req, res, next) => {
  db.getSubscribers()
    .then(prepareSubscribers)
    .then(subscribers => res.json(subscribers))
    .catch(next)
})

router.post('/subscribers', authRequired.asAdmin, (req, res, next) => {
  const subscriber = req.body
  console.log(subscriber)
  db.newSubscriber(subscriber)
    .then(result => res.json('ok'))
    .catch(next)
})

module.exports = router
