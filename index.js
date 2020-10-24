const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const passport = require('./config/passport/passport')
const authController = require('./controllers/authController')

app.use(bodyParser.json())
app.use(passport.initialize())

app.post('/register', authController.register)
app.post('/login', authController.login)
app.use('/user', require('./routes/user'))

app.get('*', (req, res) => {
  res.status(200).send({
    message: 'hello world'
  })
})

app.listen(3000, () => {
  console.log('listening...')
})