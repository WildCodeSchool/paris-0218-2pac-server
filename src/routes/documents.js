const express = require('express')
const router = express.Router()
const { authRequired } = require('../middlewares.js')
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

router.get('/documents', (req, res, next) => {
  const isMember = req.user && !req.user.isAdmin
  const isAdmin = req.user && req.user.isAdmin
  const isDocumentPublic = doc => !doc.isMemberOnly
  const isDocumentNotArchived = doc => !doc.isArchived

  db.getDocuments()
    .then(documents => {
      if (isAdmin) { return documents }

      const notArchivedDocuments = documents.filter(isDocumentNotArchived)

      return isMember ? notArchivedDocuments : notArchivedDocuments.filter(isDocumentPublic)
    })
    .then(documents => res.json(documents))
    .catch(next)
})

router.post('/documents', authRequired.asAdmin, (req, res, next) => {
  const body = req.body

  const doc = {
    typeId: Number(body.typeId),
    title: body.title || '',
    shortDescription: body.shortDescription || '',
    isMemberOnly: body.isMemberOnly || false,
    isResource: body.isResource || true,
    isArchived: body.isArchived || false,
    url: body.url
  }

  db.newDocument(doc)
    .then(() => res.json('ok'))
    .catch(next)
})

router.put('/documents/:id', authRequired.asAdmin, (req, res, next) => {
  const body = req.body

  const docId = Number(req.params.id) || body.id

  const updates = {
    typeId: Number(body.typeId),
    title: body.title || '',
    shortDescription: body.shortDescription || '',
    isMemberOnly: body.isMemberOnly || false,
    isResource: body.isResource || true,
    isArchived: body.isArchived || false,
    url: body.url
  }

  db.updateDocument(docId, updates)
    .then(() => res.json('ok'))
    .catch(next)
})

router.delete('/documents/:id', authRequired.asAdmin, (req, res, next) => {
  const documentId = req.params.id

  db.deleteDocument(documentId)
    .then(() => res.json('ok'))
    .catch(next)
})

module.exports = router
