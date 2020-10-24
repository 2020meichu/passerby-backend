const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('../../../model/db')
const admins = db.collection('admins')
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const verifyFunction = async (payload, done) => {
  try {
    if (!payload || !payload.id) {
      return done(null, false, 401)
    }
    const admin = await (await admins.doc(payload.id).get()).data()
    if (!admin) {
      return done(null, false)
    } else {
      return done(null, admin)
    }
  } catch (error) {
    console.log(error)
    return done(error)
  }
}

module.exports = new JwtStrategy(options, verifyFunction)