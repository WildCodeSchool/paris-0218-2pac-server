const authRequired = (req, res, next) => {
  if (!req.user) { return res.status(401).json('Authentication required') }

  next()
}

authRequired.asAdmin = (req, res, next) => {
  if (!req.user) { return res.status(401).json('Authentication required') }

  if (!req.user.isAdmin) { return res.status(401).json('Admin authentication required') }

  next()
}

module.exports = {
  authRequired,
}
