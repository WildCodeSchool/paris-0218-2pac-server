const express = require('express')
const router = express.Router()
const { authRequired } = require('../middlewares.js')
const db = require('../db/db-sql.js')

router.get('/statics', (req, res, next) => {
  db.getStatics()
    .then(statics => res.json(statics))
    .catch(next)
})

router.put('/statics/:id', authRequired.asAdmin, (req, res, next) => {
  const static = req.body
  const staticId = Number(req.params.id) || static.id

  const updates = {
    content: static.content || ''
  }

  db.updateStatic(staticId, updates)
    .then(() => res.json('ok'))
    .catch(next)
})

module.exports = router
