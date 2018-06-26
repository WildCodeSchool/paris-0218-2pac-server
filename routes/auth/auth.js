const express = require('express')
const router = express.Router()
const connection = require('../../sql/db.js')

const jwt = require('jsonwebtoken')

const jwtSecret = require('../../../jwtSecret')

const exec = async (query, params) => {
  const connect = await connection
  const result = await connect.execute(query, params)

  return result[0]
}

// création d'un article
router.post('/articles', (req, res, next) => {
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
router.put('/articles/:id', (req, res, next) => {
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

router.delete('/articles/:id', (req, res, next) => {
  deleteArticle()
    .then(articles => res.json(articles))
    .catch(next)
})

// récupération des articles
const getArticles = () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.id;`)

router.get('/articles/', (req, res, next) => {
  getArticles()
    .then(articles => res.json(articles))
    .catch(next)
})

/* DOCUMENTS */
// récupération des documents
const getDocuments = () => exec(`SELECT * FROM  documents;`)

router.get('/documents/', (req, res, next) => {
  getDocuments()
    .then(documents => res.json(documents))
    .catch(next)
})

// création d'un document
router.post('/documents', (req, res, next) => {
  exec(`
    INSERT INTO documents
      (typeId, title, shortDescription, url, isMemberOnly, isResource, isArchived)
    VALUES
      (:typeId, :title, :shortDescription, :url, :isMemberOnly, :isResource, :isArchived)`,
  req.body)
    .then(result => res.status(200).json('oki'))
    .catch(next)
})

// supression d'un document

const deleteDocument = id => exec(`DELETE FROM documents WHERE id=?`, [ id ])

router.delete('/documents/:id', (req, res, next) => {
  deleteDocument()
    .then(documents => res.json(documents))
    .catch(next)
})

// mise à jour d'un document

router.put('/documents/:id', (req, res, next) => {
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

// récupération des catégories d'articles
const getArticleCategories = () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.id;`)

router.get('/getArticleCategories/', (req, res, next) => {
  getArticleCategories()
    .then(articleCategories => res.json(articleCategories))
    .catch(next)
})

// AUTHENTIFICATION

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

// récupération des utilisateurs
const getUsers = () => exec(`SELECT * FROM users;`)

router.get('/users/', (req, res, next) => {
  getUsers()
    .then(users => res.json(users))
    .catch(next)
})

// récupération des abonnés
const getSuscribers = () => exec(`SELECT * FROM subscribers;`)

router.get('/suscribers/', (req, res, next) => {
  getSuscribers()
    .then(subscribers => res.json(subscribers))
    .catch(next)
})

router.post('/signup', (req, res, next) => {
  console.log(req.body)
  if (req.body.username === 'coco' && req.body.password === 'channel') {
    user = { username: req.body.username }
    const tokenUserinfo = { username: user.username, status: 'PouletMaster' }// status: recup via la bdd
    const token = jwt.sign(tokenUserinfo, jwtSecret)
    res.header('Access-Control-Expose-Headers', 'x-access-token')
    res.set('x-access-token', token)
    res.status(200).send({ details: 'user connected', user })
  }
})

router.post('/protected', (req, res, next) => {
  const token = getToken(req)
  const objectTests = { // data appelée par la bdd
    test: 'ok'
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(200).send({mess: 'pas accès aux données'})
    }
    console.log('decode', decoded)
    return res.status(200).send({mess: 'Données utilisateur', objectTests })
  })
})

module.exports = router
