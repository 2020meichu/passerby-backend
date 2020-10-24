const express = require('express')
const router = express.Router()
const passport = require('../config/passport/passport')
const userController = require('../controllers/userController')
const user = require('../model/user')

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', userController.getUser)
router.get('/footprints', userController.getFootprints)
router.post('/footprints', userController.addFootprints)

module.exports = router