const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const passport = require('../config/passport/passport')
const userModel = require('../model/user')
const db = require('../model/db')
const userCollection = db.collection('users')
const isValidId = require('../utils/isValidId')
const issueToken = require('../utils/issueToken')

const authController = {
  async register (req, res) {
    try {
      const { id, password, username } = req.body
      const { avatar, id_photo } = req.files
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
      if (!avatar) {
        return res.status(400).send({ message: '未附上大頭貼' })
      }
      if (!id_photo) {
        return res.status(400).send({ message: '未附上身分證照片' })
      }

      const user = await (await userCollection.doc(id).get()).data()
      if (user) { // 使用者已存在
        return res.status(403).send({ message: '該身分證字號已進行過註冊' })
      } else {
        // 將照片從 temp 移至 public
        const avatarTempPath = path.join(__dirname, '..', 'temp', avatar[0].filename)
        const avatarDestPath = path.join(__dirname, '..', 'public', 'images', `avatar_${id}.jpg`)
        fs.copyFileSync(avatarTempPath, avatarDestPath)
        const idPhotoTempPath = path.join(__dirname, '..', 'temp', id_photo[0].filename)
        const idPhotoDestPath = path.join(__dirname, '..', 'public', 'images', `id_photo_${id}.jpg`)
        fs.copyFileSync(idPhotoTempPath, idPhotoDestPath)

        // 建立 user
        const newUser = JSON.parse(JSON.stringify(userModel))
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        Object.assign(newUser, { 
          id,
          username,
          password: hash,
          id_photo: `/images/id_photo_${id}.jpg`,
          avatar: `/images/avatar_${id}.jpg`,
        })

        // 寫入 firestore
        await userCollection.doc(id).set(newUser)

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
  },
  async login (req, res, next) {
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
    passport.authenticate('user-local', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).send(err)
      } else if (info) {
        if (info.message === 'not found') {
          return res.status(404).send({ message: '無此使用者' })
        } else if (info.message === 'wrong password') {
          return res.status(403).send({ message: '密碼錯誤' })
        } 
      } else {
        const token = issueToken(user.id)
        return res.status(200).send({ user, token })
      }
    })(req, res, next)
  }
}

module.exports = authController