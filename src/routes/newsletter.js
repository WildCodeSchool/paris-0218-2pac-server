const express = require('express')
const router = express.Router()
const db = require('../sql/db.js')

//récupération des informations sur les abonnés à la Newsletter
router.get('/subscribers/', (req, res, next) => {
    db.getSubscribers()
    .then(subscribers => res.json(subscribers))
    .catch(next)
})

//envoi des données d'un suscriber à la Newsletter en bdd
router.post('/subscribers', (req, res, next) => {
  const subscriber = req.body
  console.log(req.body)

  db.newSubscriber(subscriber)
    .then(result => res.json('oki'))
    .catch(next)
})

module.exports = router
