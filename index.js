const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const passport = require('./config/passport/passport')

app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/', require('./routes/index'))

app.listen(3000, () => {
  console.log('listening...')
})