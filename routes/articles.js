const express = require('express')
const router = express.Router()
const db = require('../sql/db.js')

// récupération des articles

router.get('/articles/', (req, res, next) => {
  db.getArticles()
    .then(articles => res.json(articles))
    .catch(next)
})


// création d'un article
router.post('/articles', (req, res, next) => {
  const article = req.body

  db.newArticle(article)
    .then(result => res.json('oki'))
    .catch(next)
})

module.exports = router
