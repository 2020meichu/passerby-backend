const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('./config/passport/passport')

app.use((req, res, next) => {
  if (req.headers['x-api-key'] !== process.env.X_API_KEY) {
    return res.status(401).send('Unauthorized')
  }
  next()
})
app.use(cors())
app.options('*', cors())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/', require('./routes/index'))

app.listen(3000, () => {
  console.log('listening...')
})
