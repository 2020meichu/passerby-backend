const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('./config/passport/passport')

app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/', require('./routes/index'))

app.listen(3000, () => {
  console.log('listening...')
})
