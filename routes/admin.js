const express = require('express')
const router = express.Router()
const passport = require('../config/passport/passport')
const adminController = require('../controllers/adminController')

router.post('/', passport.authenticate('admin-jwt', { session: false }), adminController.addAdmin)
router.post('/login', adminController.adminLogin)
router.get('/user/:id', adminController.getUserById)

module.exports = router