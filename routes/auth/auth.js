const express = require('express')
//const router = express.Router()
const connection = require('../../sql/db.js')
const bodyParser = require('body-parser')
const app = express()

// MIDDLEWARES

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})


const exec = async (query, params) => {
  const connect = await connection
  const result = await connect.execute(query, params)

  return result[0]
}


// création d'un article
app.post('/createArticle', (req, res, next) => {
  exec(`
    INSERT INTO articles
      (title, shortDescription, description, eventDate, categoryId, imageURL, imageDescription)
    VALUES
      (:title, :shortDescription, :description, :eventDate, :categoryId, :imageURL, :imageDescription)`,
    req.body)
  .then(result => res.status(200).json('oki'))
  .catch(next)
})

// mise à jour d'un article
app.put('/updateArticle/:id', (req, res, next) => {

  exec(`
    UPDATE articles
    SET
      title=:title,
      shortDescription=:shortDescription,
      description=:description,
      eventDate=:eventDate,
      categoryId=:categoryId,
      imageURL=:imageURL,
      imageDescription=:imageDescription
    WHERE id=:id`, {
      ...req.body,
      id: req.params.id
    })
  .then(res => res.status(200).json('oki'))
  .catch(next)
  })

// suppression des données des articles de la BDD
const deleteArticle = id => exec(`DELETE FROM articles WHERE id=:id`, [ id ])

app.delete('/deleteArticle/:id', (req, res, next) => {
    deleteArticle()
    .then(articles => res.json(articles))
    .catch(next)
})

// récupération des articles
const getArticles= () => exec(`SELECT * FROM  articles;`)


app.get('/getArticles/', (req, res, next) => {
     getArticles()
    .then(articles => res.json(articles))
    .catch(next)
})

/*DOCUMENTS */
// récupération des documents
const getDocuments= () => exec(`SELECT * FROM  documents;`)


app.get('/getDocuments/', (req, res, next) => {
     getDocuments()
    .then(documents => res.json(documents))
    .catch(next)
})

// création d'un document
app.post('/createDocument', (req, res, next) => {
  exec(`
    INSERT INTO documents
      (typeId, title, shortDescription, url, isMemberOnly, isResource, isArchived)
    VALUES
      (:typeId, :title, :shortDescription, :url, :isMemberOnly, :isResource, :isArchived)`,
    req.body)
  .then(result => res.status(200).json('oki'))
  .catch(next)
})


//supression d'un document

const deleteDocument = id => exec(`DELETE FROM documents WHERE id=?`, [ id ])

app.delete('/deleteDocument/:id', (req, res, next) => {
    deleteDocument()
    .then(documents => res.json(documents))
    .catch(next)
})

//mise à jour d'un document

app.put('/updateDocument/:id', (req, res, next) => {

  exec(`
    UPDATE documents
    SET
      typeId=:typeId,
      title=:title,
      shortDescription=:shortDescription,
      url=:url,
      isMemberOnly=:isMemberOnly,
      isResource=:isResource,
      isArchived=:isArchived
    WHERE id=:id`, {
      ...req.body,
      id: req.params.id
    })
  .then(res => res.status(200).json('oki'))
  .catch(next)
  })

module.exports =  app;

