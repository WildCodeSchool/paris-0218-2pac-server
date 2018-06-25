const express = require('express')
// const router = express.Router()
const connection = require('../../sql/db.js')
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken')

const jwtSecret = require("../../../jwtSecret")

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
const getArticles = () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.id;`)

app.get('/getArticles/', (req, res, next) => {
  getArticles()
    .then(articles => res.json(articles))
    .catch(next)
})

/* DOCUMENTS */
// récupération des documents
const getDocuments = () => exec(`SELECT * FROM  documents;`)

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

// supression d'un document

const deleteDocument = id => exec(`DELETE FROM documents WHERE id=?`, [ id ])

app.delete('/deleteDocument/:id', (req, res, next) => {
  deleteDocument()
    .then(documents => res.json(documents))
    .catch(next)
})

// mise à jour d'un document

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

//récupération des catégories d'articles
const getArticleCategories = () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.id;`)

app.get('/getArticleCategories/', (req, res, next) => {
  getArticleCategories()
    .then(articleCategories => res.json(articleCategories))
    .catch(next)
})

//AUTHENTIFICATION

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1]
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};



// récupération des utilisateurs
const getUsers = () => exec(`SELECT * FROM users;`)

app.get('/getUsers/', (req, res, next) => {
  getUsers()
    .then(users => res.json(users))
    .catch(next)
})


// récupération des abonnés
const getSuscribers = () => exec(`SELECT * FROM subscribers;`)

app.get('/getSuscribers/', (req, res, next) => {
  getSuscribers()
    .then(subscribers => res.json(subscribers))
    .catch(next)
})



app.post('/signup', (req, res, next) => {
  console.log(req.body)
  if (req.body.username === "coco" && req.body.password === "channel" ) {
    // res.send("I am in POST signup")
        user = { username: req.body.username }
         const tokenUserinfo = { username: user.username, status: 'PouletMaster' }//status: recup via la bdd
         const token = jwt.sign(tokenUserinfo, jwtSecret)
         res.header("Access-Control-Expose-Headers", "x-access-token")
         res.set("x-access-token", token)
         res.status(200).send({ details: "user connected", user })
  }
})

app.post('/protected', (req, res, next) => {
  const token = getToken(req);
  const objectTests = { //data appelée par la bdd
  test: 'ok',
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if(err) {
      console.log(err)
     return res.status(200).send({mess: 'pas accès aux données'})
    }
    console.log('decode',decoded)
    return res.status(200).send({mess: 'Données utilisateur', objectTests })
  })
})






module.exports = app
