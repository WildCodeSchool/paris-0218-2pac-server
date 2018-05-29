const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Tu es a la racine')
})