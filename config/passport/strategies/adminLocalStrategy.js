const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const options = { usernameField: 'id', passwordField: 'password' }
const db = require('../../../model/db')
const adminCollection = db.collection('admins')

const verifyFunction = async (id, password, done) => {
  try {
    const admin = await (await adminCollection.doc(id).get()).data()
    if (!admin) {
      return done(null, false, { message: 'not found'})
    } else if (!bcrypt.compareSync(password, admin.password)) {
      return done(null, false, { message: 'wrong password' })
    } else {
      return done(null, admin)
    }
  } catch (err) {
    return done(null, false, 500)
  }
}

module.exports = new LocalStrategy(options, verifyFunction)