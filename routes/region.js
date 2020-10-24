const express = require('express')
const router = express.Router()
const passport = require('../config/passport/passport')
const adminController = require('../controllers/adminController')

router.route('/')
  .post(passport.authenticate('admin-jwt', { session: false }), adminController.addRegion)
  .patch(passport.authenticate('admin-jwt', { session: false }), adminController.updateRegion)

module.exports = router