const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()

const db = require('../sql/db.js')

const publicDocumentsPath = path.join(__dirname, '../../public/documents')
console.log({publicDocumentsPath})
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
router.post('/documents', upload.single("document"), (req, res, next) => {
  // console.log(req.file)
  // console.log(req.body)
  const file = req.file

  const doc = {
    ...req.body,
    url: file.filename //+ path.extname(file.originalname)
  }

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
