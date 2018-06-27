const express = require('express')
const router = express.Router()
const db = require('../sql/db.js')

// récupération des articles

router.get('/articles/', (req, res, next) => {
  db.getArticles()
    .then(articles => res.json(articles))
    .catch(next)
})
router.get('/articlesCat/', (req, res, next) => {
  db.getArticlesCat()
    .then(articleCategories => res.json(articleCategories))
    .catch(next)
})

// création d'un article
router.post('/articles', (req, res, next) => {
  const article = req.body
  console.log(req.body)

  db.newArticle(article)
    .then(result => res.json('oki'))
    .catch(next)
})

// suppression d'un article

router.delete('/articles/:id', (req, res, next) => {
  const articleId = req.params.id

  db.deleteArticle(articleId)
    .then(() => res.json('ok'))
    .catch(next)
})

module.exports = router
