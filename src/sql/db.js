const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pac',
  namedPlaceholders: true
})

const exec = async (query, params) => {
  const connect = await connection
  const result = await connect.execute(query, params)

  return result[0]
}

const getArticles = () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.id;`)

const newArticle = article => exec(`
    INSERT INTO articles
      (title, shortDescription, description, eventDate, categoryId, imageURL, imageDescription)
    VALUES
      (:title, :shortDescription, :description, :eventDate, :categoryId, :imageURL, :imageDescription)`,
article)

const deleteArticle = (id) => exec(`DELETE FROM articles WHERE id=?`, [ id ])

// mise à jour d'un article
const updateArticle = params => exec(`
    UPDATE articles
    SET
      title=?,
      shortDescription=?,
      description=?,
      eventDate=?,
      categoryId=?,
      imageURL=?,
      imageDescription=?
    WHERE id=?`, [
  params.title,
  params.shortDescription,
  params.description,
  params.eventDate,
  params.categoryId,
  params.imageURL,
  params.imageDescription,
  params.id
])

// récupération des documents
const getDocuments = () => exec(`SELECT * FROM documents LEFT JOIN documents_types on documents.typeId = documents_types.id;`)

// création d'un document
const newDocument = doc => exec(`
  INSERT INTO documents
    (typeId, title, shortDescription, url, isMemberOnly, isResource, isArchived)
  VALUES
    (:typeId, :title, :shortDescription, :url, :isMemberOnly, :isResource, :isArchived)`,
doc)

// suppression d'un document
const deleteDocument = id => exec(`DELETE FROM documents WHERE id=?`, [ id ])

// //mise à jour d'un document
// const updateDocument = params => exec(`
//     UPDATE documents
//     SET
//       typeId=?,
//       title=?,
//       shortDescription=?,
//       url=?,
//       isMemberOnly=?,
//       isResource=?,
//       isArchived=?
//     WHERE id=?`, [ params.typeId, params.title, params.shortDescription, params.url, params.isMemberOnly,
//     params.isResource, params.isArchived, params.id])

module.exports = {
  getArticles,
  newArticle,
  updateArticle,
  deleteArticle,
  getDocuments,
  newDocument,
  // updateDocument,
  deleteDocument,
}
