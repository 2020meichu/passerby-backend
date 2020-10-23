const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const passport = require('./config/passport/passport')
const userModel = require('./model/user')
const isValidId = require('./utils/isValidId')
const issueToken = require('./utils/issueToken')
const db = require('./model/db')
const users = db.collection('users')

app.use(bodyParser.json())
app.use(passport.initialize())

app.post('/register', async (req, res) => {
  try {
    const { id, password, username } = req.body
    // 檢查參數
    if (!id) {
      return res.status(400).send({ message: '未附上身分證字號' })
    }
    if (!password) {
      return res.status(400).send({ message: '未附上密碼' })
    }
    if (!username) {
      return res.status(400).send({ message: '未附上名稱' })
    }
    if (!isValidId(id)) {
      return res.status(400).send({ message: '不合法的身分證字號' })
    }

    const user = await (await users.doc(id).get()).data()
    if (user) { // 使用者已存在
      return res.status(403).send({ message: '該身分證字號已進行過註冊' })
    } else {
       // 建立 user
      const newUser = JSON.parse(JSON.stringify(userModel))
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(password, salt)
      Object.assign(newUser, { id, username, password: hash })

      // 寫入 firestore
      await users.doc(id).set(newUser)

      // 生成 token & 回傳使用者資料
      const token = issueToken(id)
      delete newUser['password']
      return res.status(200).send({ user: newUser, token })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: error.message
    })
  }
})
app.post(
  '/login',
  (req, res, next) => {
    const { id, password } = req.body
    if (!id) {
      return res.status(400).send({ message: '未附上身分證字號' })
    }
    if (!password) {
      return res.status(400).send({ message: '未附上密碼' })
    }
    if (!isValidId(id)) {
      return res.status(400).send({ message: '不合法的身分證字號' })
    }
    next()
  },
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).send(err)
      } else if (info.message === 'not found') {
        return res.status(404).send({ message: '無此使用者' })
      } else if (info.message === 'wrong password') {
        return res.status(403).send({ message: '密碼錯誤' })
      } else {
        const token = issueToken(user.id)
        return res.status(200).send({ user, token })
      }
    })(req, res, next)
  }
)

app.get('*', (req, res) => {
  res.status(200).send({
    message: 'hello world'
  })
})

app.listen(3000, () => {
  console.log('listening...')
})