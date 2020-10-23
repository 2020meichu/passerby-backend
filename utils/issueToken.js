const jwt = require('jsonwebtoken')

module.exports = (id) => {
  const payload = { id: id }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}