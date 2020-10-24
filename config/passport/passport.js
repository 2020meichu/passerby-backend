const passport = require('passport')
const userLocalStrategy = require('./strategies/userLocalStrategy')
const userJwtStrategy = require('./strategies/userJwtStrategy')
const adminLocalStrategy = require('./strategies/adminLocalStrategy')
const adminJwtStrategy = require('./strategies/adminJwtStrategy')

passport.use('user-local', userLocalStrategy)
passport.use('user-jwt', userJwtStrategy)
passport.use('admin-local', adminLocalStrategy)
passport.use('admin-jwt', adminJwtStrategy)

module.exports = passport