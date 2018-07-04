const express = require('express')
const router = express.Router()
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

// récupération des articles
router.get('/articles', (req, res, next) => {
  db.getArticles()
    .then(articles => res.json(articles))
    .catch(next)
})

// création d'un article
router.post('/articles', (req, res, next) => {
  const article = req.body

  db.newArticle(article)
    .then(() => res.json('ok'))
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
