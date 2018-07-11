const users = require('../../mocks/users.json')
const articles = require('../../mocks/articles.json')
const documents = require('../../mocks/documents.json')

module.exports = {
  getUsers: () => Promise.resolve(users),
  newUser: () => Promise.resolve(),
  deleteUser: () => Promise.resolve(),
  getArticles: () => Promise.resolve(articles),
  newArticle: () => Promise.resolve(),
  updateArticle: () => Promise.resolve(),
  deleteArticle: () => Promise.resolve(),
  getDocuments: () => Promise.resolve(documents),
  newDocument: () => Promise.resolve(),
  deleteDocument: () => Promise.resolve()
}
