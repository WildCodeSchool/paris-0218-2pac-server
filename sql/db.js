const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Victoria01',
  database: 'pac',
  namedPlaceholders: true
})

module.exports = connection
