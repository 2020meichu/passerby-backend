const express = require('express')
const router = express.Router()
const passport = require('../config/passport/passport')
const adminController = require('../controllers/adminController')

router.route('/')
  .post(passport.authenticate('admin-jwt', { session: false }), adminController.addDisease)
  .patch(passport.authenticate('admin-jwt', { session: false }), adminController.updateDisease)

module.exports = router