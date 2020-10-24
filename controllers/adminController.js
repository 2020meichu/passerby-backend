const passport = require('../config/passport/passport')
const issueToken = require('../utils/issueToken')
const db = require('../model/db')
const adminCollection = db.collection('admins')
const bcrypt = require('bcrypt')

const adminController = {
  async adminLogin (req, res, next) {
    try {
      const { id, password } = req.body
      if (!id) {
        return res.status(400).send({ message: '未附上管理者帳號' })
      }
      if (!password) {
        return res.status(400).send({ message: '未附上密碼' })
      }
      passport.authenticate('admin-local', { session: false }, (err, admin, info) => {
        if (err) {
          return res.status(500).send(err)
        } else if (info) {
          if (info.message === 'not found') {
            return res.status(404).send({ message: '無此管理者' })
          } else if (info.message === 'wrong password') {
            return res.status(403).send({ message: '密碼錯誤' })
          } 
        } else {
          const token = issueToken(admin.id)
          return res.status(200).send({ token })
        }
      })(req, res, next)
    } catch (error) {
       console.log(error)
       return res.status(500).send({ message: error.message })
    }
  },
  async addAdmin (req, res) {
    try {
      const { newAdminId, newAdminPassword } = req.body
      if (!newAdminId || !newAdminPassword) {
        return res.status(400).send({ message: '未附上新帳號或密碼' })
      }

      const newAdmin = await (await adminCollection.doc(newAdminId).get()).data()
      if (!newAdmin) {
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(newAdminPassword, salt)
        await adminCollection.doc(newAdminId).set({ id: newAdminId, password: hash })
        return res.status(200).send({ message: '成功新增管理者帳號' })
      } else {
        return res.status(403).send({ message: '該管理者帳號已經存在' })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async getUserById (req, res) {

  },
  async setLightRules (req, res) {

  }
}

module.exports = adminController