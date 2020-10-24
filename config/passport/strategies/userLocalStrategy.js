const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const options = { usernameField: 'id', passwordField: 'password' }
const db = require('../../../model/db')
const users = db.collection('users')

const verifyFunction = async (id, password, done) => {
  try {
    const user = await (await users.doc(id).get()).data()
    if (!user) {
      return done(null, false, { message: 'not found'})
    } else if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'wrong password' })
    } else {
      delete user.password
      return done(null, user)
    }
  } catch (err) {
    return done(null, false, 500)
  }
}

module.exports = new LocalStrategy(options, verifyFunction)