const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()
const { authRequired } = require('../middlewares.js')
const db = require(process.env.MOCKS ? '../db/db-mocks.js' : '../db/db-sql.js')

const publicDocumentsPath = path.join(__dirname, '../../public/documents')
console.log({ publicDocumentsPath })

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
  db.getDocuments()
    .then(documents => res.json(documents))
    .catch(next)
})

// création d'un document
router.post('/documents', authRequired.asAdmin, upload.single('document'), (req, res, next) => {
  const file = req.file

  if (!file) {
    return next(Error('missing document'))
  }

  const body = req.body

  const doc = {
    typeId: Number(body.typeId),
    title: body.title,
    shortDescription: body.shortDescription,
    isMemberOnly: Boolean(body.isMemberOnly),
    isResource: Boolean(body.isResource),
    isArchived: false,
    url: file.filename // + path.extname(file.originalname)
  }

  db.newDocument(doc)
    .then(() => res.json('ok'))
    .catch(next)
})

// supression d'un document
router.delete('/documents/:id', authRequired.asAdmin, (req, res, next) => {
  const documentId = req.params.id

  db.deleteDocument(documentId)
    .then(() => res.json('ok'))
    .catch(next)
})

// mise à jour d'un document
router.put('/documents/:id', (req, res, next) => {
  const docId = req.params.id
  const updates = req.body

  db.updateDocument(docId, updates)
    .then(() => res.json('ok'))
    .catch(next)
})

module.exports = router
