const express = require('express')
const router = express.Router()
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')


const prepareSubscriber = subscriber => ({
  ...subscriber,
  reuseableInfo: Boolean(subscriber.reuseableInfo)
})
const prepareSubscribers = subscribers => subscribers.map(prepareSubscriber)


// récupération des données abonnés
router.get('/subscribers', (req, res, next) => {
  db.getSubscribers()
    .then(prepareSubscribers)
    .then(subscribers => res.json(subscribers))
    .catch(next)
})


// envoi des données abonnés
router.post('/subscribers', (req, res, next) => {
  const subscriber = req.body
  console.log(subscriber)
  db.newSubscriber(subscriber)
    .then(result => res.json('ok'))
    .catch(next)
})

module.exports = router
