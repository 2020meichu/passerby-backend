const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const authController = require('../controllers/authController')
const configurationController = require('../controllers/configurationController')

router.post(
  '/register',
  upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'id_photo', maxCount: 1 }]),
  authController.register
)
router.post('/login', authController.login)
router.get('/configuration', configurationController.getConfiguration)
router.use('/user', require('./user'))
router.use('/admin', require('./admin'))
router.use('/disease', require('./disease'))
router.use('/region', require('./region'))
router.use('/rules', require('./rule'))

router.get('*', (req, res) => {
  res.status(200).send({
    message: 'hello world'
  })
})

module.exports = router