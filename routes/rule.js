const express = require('express')
const router = express.Router()
const passport = require('../config/passport/passport')
const adminController = require('../controllers/adminController')

router.route('/')
  .get(passport.authenticate('admin-jwt', { session: false }), adminController.getLightRules)
  .post(passport.authenticate('admin-jwt', { session: false }), adminController.setLightRules)

module.exports = router