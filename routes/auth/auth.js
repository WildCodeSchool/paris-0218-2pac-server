const express = require('express')
const router = express.Router()
const connection = require('../../sql/db.js')

// const exec = async (query, params) => {
// const connection = await pendingConnection
// console.log('executing', query, params)
// const result = await connection.execute(query, params)
// return result[0]
// }

// insertion des données des articles dans la BDD
router.post('/articles', (req, res, next) => {
  const query = connection.query('INSERT INTO articles (title, shortDescription, description, eventDate, categoryId, imageURL, imageDescription) VALUES (?,?,?,?,?,?,?,?)',
    [req.body.title, req.body.shortDescription, req.body.description, req.body.eventDate, req.body.categoryId, req.body.imageURL, req.body.imageDescription],
    (error, results, fields) => {
      if (error) { res.status(500).json('erreur') } else { res.status(200).json('oki') }
    })
})
// res.end('postman c nul')
// })

module.exports = router
