const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('../../../model/db')
const users = db.collection('users')
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const verifyFunction = async (payload, done) => {
  try {
    if (!payload || !payload.id) {
      return done(null, false, 401)
    }
    const user = await (await users.doc(payload.id).get()).data()
    if (!user) {
      return done(null, false)
    } else {
      delete user.password
      return done(null, user)
    }
  } catch (error) {
    console.log(error)
    return done(error)
  }
}

module.exports = new JwtStrategy(options, verifyFunction)