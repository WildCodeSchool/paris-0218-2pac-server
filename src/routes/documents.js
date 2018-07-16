const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()
const { formData } = require('../utils.js')
const { authRequired } = require('../middlewares.js')
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

const publicDocumentsPath = path.join(__dirname, '../../public/documents')

const storage = multer.diskStorage({
  destination: publicDocumentsPath,
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30000000 // 30 MB
  },
  fileFilter: (req, files, cb) => {
    // if (!files.mimetype.startsWith('image/')) { // accept image only
    //   return cb(Error('Invalid file type'))
    // }
    cb(null, true)
  }
})

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

router.post('/documents', authRequired.asAdmin, upload.single('document'), (req, res, next) => {
  const file = req.file

  if (!file) {
    return next(Error('missing document'))
  }

  const body = req.body

  const doc = {
    typeId: Number(body.typeId),
    title: body.title || '',
    shortDescription: body.shortDescription || '',
    isMemberOnly: formData.Boolean(body.isMemberOnly) || false,
    isResource: formData.Boolean(body.isResource) || false,
    isArchived: formData.Boolean(body.isArchived) || false,
    url: file.filename // + path.extname(file.originalname)
  }

  db.newDocument(doc)
    .then(() => res.json('ok'))
    .catch(next)
})

router.put('/documents/:id', authRequired.asAdmin, upload.single('document'), (req, res, next) => {
  const doc = req.body

  const docId = Number(req.params.id) || doc.id

  const updates = {
    typeId: Number(doc.typeId),
    title: doc.title || '',
    shortDescription: doc.shortDescription || '',
    isMemberOnly: formData.Boolean(doc.isMemberOnly) || false,
    isResource: formData.Boolean(doc.isResource) || false,
    isArchived: formData.Boolean(doc.isArchived) || false
  }

  if (req.file) {
    updates.url = req.file.filename
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
