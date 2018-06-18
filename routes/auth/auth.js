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

  const query = exec(`INSERT INTO articles (title, shortDescription, description, eventDate, categoryId, imageURL, imageDescription) VALUES (?,?,?,?,?,?,?)`,
    [req.body.title, req.body.shortDescription, req.body.description, req.body.eventDate, req.body.categoryId, req.body.imageURL, req.body.imageDescription],
    (error, results, fields) => {
      if (error)
        res.status(500).json(error.message)
      else
        res.status(200).json('oki')
    })
})



// récupération des articles
const getArticles= () => exec(`SELECT * FROM  articles;`)


app.get('/getArticles/', (req, res, next) => {
     getArticles()
    .then(articles => res.json(articles))
    .catch(next)
})


module.exports =   app;

