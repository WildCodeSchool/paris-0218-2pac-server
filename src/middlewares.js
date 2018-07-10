const authRequired = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  next()
}

authRequired.asAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  if (!req.user.isAdmin) {
    return res.status(401).json({ error: 'Admin authentication required' })
  }

  next()
}

module.exports = {
  authRequired,
}
