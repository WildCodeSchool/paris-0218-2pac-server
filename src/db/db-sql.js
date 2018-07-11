const mysql = require('mysql2/promise')

const defaultUrl = 'mysql://root@localhost/pac'

if (!process.env.DATABASE_URL) {
  console.warn(`'DATABASE_URL' environment variable is not set! -> fallback to default mysql default url: '${defaultUrl}'`)
}
const url = process.env.DATABASE_URL || defaultUrl
const pool = mysql.createPool(`${url}?waitForConnections=true&connectionLimit=10&queueLimit=0&namedPlaceholders=true`) // namedPlaceholders: true

const first = async q => (await q)[0]
const exec = (query, params) => {
  // console.log('SQL - ', { query, params })
  return first(pool.execute(query, params))
}

const exec1 = (query, params) => first(exec(`${query} LIMIT 1`, params))

// USERS

const prepareUser = user => ({
  ...user,
  isAdmin: Boolean(user.isAdmin)
})
const prepareUsers = users => users.map(prepareUser)

const getUsers = () => exec(`SELECT * FROM users;`).then(prepareUsers)
getUsers.byId = id => exec1(`SELECT * FROM users WHERE id=?`, [ id ]).then(prepareUser)
getUsers.byUsername = username => exec1(`SELECT * FROM users WHERE username=?`, [ username ]).then(prepareUser)

const newUser = user => exec(`INSERT INTO users (username, password, isAdmin)
  VALUES (:username, :password, :isAdmin)`, user)

const deleteUser = (id) => exec(`DELETE FROM users WHERE id=?`, [ id ])

// ARTICLES

const getArticles = () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.categoryId;`)

const newArticle = article => exec(`
    INSERT INTO articles
      (title, shortDescription, description, eventDate, categoryId, imageURL, imageDescription, isMemberOnly)
    VALUES
      (:title, :shortDescription, :description, :eventDate, :categoryId, :imageURL, :imageDescription; :isMemberOnly)`,
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
      isMemberOnly=?
    WHERE id=?`, [
  params.title,
  params.shortDescription,
  params.description,
  params.eventDate,
  params.categoryId,
  params.imageURL,
  params.imageDescription,
  params.isMemberOnly,
  params.id
])

const prepareDocument = doc => ({
  ...doc,
  isMemberOnly: Boolean(doc.isMemberOnly),
  isResource: Boolean(doc.isResource),
  isArchived: Boolean(doc.isArchived)
})

// récupération des documents
const getDocuments = async () => {
  const documents = await exec(`SELECT * FROM documents LEFT JOIN documents_types on documents.typeId = documents_types.typeId;`)

  return documents.map(prepareDocument)
}

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
 const updateDocument = params => exec(`
     UPDATE documents
     SET
       typeId=?,
       title=?,
       shortDescription=?,
       url=?,
       isMemberOnly=?,
       isResource=?,
       isArchived=?
     WHERE id=?`, [
     params.typeId,
     params.title,
     params.shortDescription,
     params.url,
     params.isMemberOnly,
     params.isResource,
     params.isArchived,
     params.id
     ])

// récupération des subscribers
const getSubscribers = () => exec(`SELECT * FROM subscribers;`)

// ajout de subscriber à la bdd
const newSubscriber = subscriber => exec(`INSERT INTO subscribers
(reuseableInfo, firstName, lastName, phoneNumber, email)
VALUES
(:reuseableInfo, :firstName, :lastName, :phoneNumber, :email);`, subscriber)

module.exports = {
  getUsers,
  newUser,
  deleteUser,
  getArticles,
  newArticle,
  updateArticle,
  deleteArticle,
  getDocuments,
  newDocument,
  updateDocument,
  deleteDocument,
  getSubscribers,
  newSubscriber
}
