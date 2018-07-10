const authRequired = (req, res, next) => {
  if (!req.user) { return res.status(401).end() }

  next()
}

authRequired.asAdmin = (req, res, next) => {
  if (!req.user) { return res.status(401).end() }

  if (!req.user.isAdmin) { return res.status(401).json('Admin role required') }

  next()
}

module.exports = {
  authRequired,
}
