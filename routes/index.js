const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const configurationController = require('../controllers/configurationController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/configuration', configurationController.getConfiguration)
router.use('/user', require('./user'))
router.use('/admin', require('./admin'))

router.get('*', (req, res) => {
  res.status(200).send({
    message: 'hello world'
  })
})

module.exports = router