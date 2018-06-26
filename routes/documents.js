const express = require('express')
const router = express.Router()

const db = require('../sql/db.js')

router.get('/documents', (req, res, next) => {
  db.getDocuments()
    .then(documents => res.json(documents))
    .catch(next)
})

// création d'un document
router.post('/documents', (req, res, next) => {
  const doc = req.body

  db.newDocument(doc)
    .then(result => res.json('ok'))
    .catch(next)
})

// supression d'un document

// const deleteDocument = id => exec(`DELETE FROM documents WHERE id=?`, [ id ])

// router.delete('/documents/:id', (req, res, next) => {
//   deleteDocument()
//     .then(documents => res.json(documents))
//     .catch(next)
// })

// mise à jour d'un document

// router.put('/documents/:id', (req, res, next) => {
//   exec(`
//     UPDATE documents
//     SET
//       typeId=:typeId,
//       title=:title,
//       shortDescription=:shortDescription,
//       url=:url,
//       isMemberOnly=:isMemberOnly,
//       isResource=:isResource,
//       isArchived=:isArchived
//     WHERE id=:id`, {
//     ...req.body,
//     id: req.params.id
//   })
//     .then(res => res.status(200).json('oki'))
//     .catch(next)
// })

module.exports = router
