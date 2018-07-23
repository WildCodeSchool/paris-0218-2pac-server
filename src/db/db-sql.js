const mysql = require('mysql2/promise')

const defaultUrl = 'mysql://root@localhost/pac'

if (!process.env.DATABASE_URL) {
  console.warn(`'DATABASE_URL' environment variable is not set! -> fallback to default mysql default url: '${defaultUrl}'`)
}
const url = process.env.DATABASE_URL || defaultUrl
const pool = mysql.createPool(`${url}?waitForConnections=true&connectionLimit=10&queueLimit=0&namedPlaceholders=true`)

// Utils

const sqlKeysPlaceholders = o => Object.keys(o).map(key => `${key}=:${key}`).join(',')

const first = async q => (await q)[0]
const exec = (query, params) => {
  console.log('SQL - ', { query, params })
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

const deleteUser = id => exec(`DELETE FROM users WHERE id=?`, [ id ])

// ARTICLES

const prepareArticle = article => ({
  ...article,
  isMemberOnly: Boolean(article.isMemberOnly),
  isStared: Boolean(article.isStared)
})
const prepareArticles = articles => articles.map(prepareArticle)

const getArticles = async () => exec(`SELECT * FROM articles LEFT JOIN articles_categories on articles.categoryId = articles_categories.categoryId;`).then(prepareArticles)
getArticles.byId = id => exec1(`SELECT * FROM articles WHERE id=?`, [ id ]).then(prepareArticle)

const cleanTags = tags => tags.split(',').map(tag => tag.trim()).join(',')

const newArticle = article => {
  article.tags = cleanTags(article.tags)

  return exec(`
    INSERT INTO articles
      (title, shortDescription, description, eventDate, categoryId, imageURL, imageDescription, isMemberOnly, isStared, tags)
    VALUES
      (:title, :shortDescription, :description, :eventDate, :categoryId, :imageURL, :imageDescription, :isMemberOnly, :isStared, :tags)`,
  article)
}

const updateArticle = article => {
  article.tags = cleanTags(article.tags)

  return exec(`
    UPDATE articles
    SET
      title=:title,
      shortDescription=:shortDescription,
      description=:description,
      eventDate=:eventDate,
      categoryId=:categoryId,
      imageURL=:imageURL,
      imageDescription=:imageDescription,
      isMemberOnly=:isMemberOnly,
      isStared=:isStared,
      tags=:tags
    WHERE id=:id`, article)
}

const deleteArticle = id => exec(`DELETE FROM articles WHERE id=?`, [ id ])

// DOCUMENTS

const prepareDocument = doc => ({
  ...doc,
  isMemberOnly: Boolean(doc.isMemberOnly)
})
const prepareDocuments = documents => documents.map(prepareDocument)

const getDocuments = () => exec(`SELECT * FROM documents LEFT JOIN documents_types on documents.typeId = documents_types.typeId;`)
  .then(prepareDocuments)

getDocuments.byId = id => exec1(`SELECT * FROM documents WHERE id=?`, [ id ]).then(prepareDocument)

const newDocument = doc => exec(`
  INSERT INTO documents
    (typeId, title, shortDescription, url, isMemberOnly)
  VALUES
    (:typeId, :title, :shortDescription, :url, :isMemberOnly)`,
doc)

const updateDocument = (id, updates) => exec(`
  UPDATE documents SET ${sqlKeysPlaceholders(updates)} WHERE id=${id}`, updates)

const deleteDocument = id => exec(`DELETE FROM documents WHERE id=?`, [ id ])

// SUBSCRIBERS

const prepareSubscriber = subscriber => ({
  ...subscriber,
  reuseableInfo: Boolean(subscriber.reuseableInfo)
})
const prepareSubscribers = subscribers => subscribers.map(prepareSubscriber)

const getSubscribers = () => exec(`SELECT * FROM subscribers;`).then(prepareSubscribers)
getSubscribers.byId = id => exec1(`SELECT * FROM subscribers WHERE id=?`, [ id ]).then(prepareSubscriber)

const newSubscriber = subscriber => exec(`INSERT INTO subscribers
(reuseableInfo, firstName, lastName, phoneNumber, email)
VALUES
(:reuseableInfo, :firstName, :lastName, :phoneNumber, :email);`, subscriber)

const deleteSubscriber = id => exec(`DELETE FROM subscribers WHERE id=?`, [ id ])

// STATICS

const getStatics = () => exec(`SELECT * FROM statics;`)
getStatics.byId = id => exec1(`SELECT * FROM statics WHERE id=?`, [ id ])
getStatics.bySlug = slug => exec1(`SELECT * FROM statics WHERE slug=?`, [ slug ])

const updateStatic = (id, updates) => exec(`
  UPDATE statics SET ${sqlKeysPlaceholders(updates)} WHERE id=${id}`, updates)

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
  newSubscriber,
  deleteSubscriber,
  getStatics,
  updateStatic
}
