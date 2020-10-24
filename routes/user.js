const express = require('express')
const router = express.Router()
const passport = require('../config/passport/passport')
const userController = require('../controllers/userController')

router.use(passport.authenticate('user-jwt', { session: false }))

router.get('/', userController.getUser)
router.get('/footprints', userController.getFootprints)
router.post('/footprints', userController.addFootprints)

module.exports = router