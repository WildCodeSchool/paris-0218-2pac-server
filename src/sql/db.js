const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Victoria01',
  database: 'pac',
  namedPlaceholders: true
})

const exec = async (query, params) => {
  const connect = await connection
  const result = await connect.execute(query, params)

  return result[0]
}

const getArticles = () => exec(`SELECT * FROM articles;`)
//const getArticles = () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.id;`)

const newArticle = article => exec(`
    INSERT INTO articles
      (title, shortDescription, description, eventDate, categoryId, imageURL, imageDescription)
    VALUES
      (:title, :shortDescription, :description, :eventDate, :categoryId, :imageURL, :imageDescription)`,
  article)

const deleteArticle = (id) => exec(`DELETE FROM articles WHERE id=?`, [ id ])


// récupération des documents
const getDocuments = () => exec(`SELECT * FROM  documents;`)

const newDocument = document => exec(`
  INSERT INTO documents
    (typeId, title, shortDescription, url, isMemberOnly, isResource, isArchived)
  VALUES
    (:typeId, :title, :shortDescription, :url, :isMemberOnly, :isResource, :isArchived)`,
  document)

module.exports = {
  getArticles,
  newArticle,
  getDocuments,
  newDocument,
  deleteArticle,
}
