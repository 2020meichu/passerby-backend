const db = require('../model/db')
const users = db.collection('users')

const userController = {
  async getUser (req, res) {
    try {
      if (!req.user) {
        return res.status(404).send({ message: 'Token 有誤或該使用者不存在' })
      }
      return res.status(200).send({ user: req.user })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async getFootprints (req, res) {
    try {
      if (!req.user) {
        return res.status(404).send({ message: 'Token 有誤或該使用者不存在' })
      }
      return res.status(200).send({ footprints: req.user.footprints })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async addFootprints (req, res) {
    try {
      if (!req.user) {
        return res.status(404).send({ message: 'Token 有誤或該使用者不存在' })
      }
      // 檢查參數
      const { longitude, latitude, location, address } = req.body
      const re = /^\d+\.*\d+$/
      if (!longitude || !latitude) {
        return res.status(400).send({ message: '座標缺漏' })
      }
      if (!re.test(longitude) || !re.test(latitude)) {
        return res.status(400).send({ message: '座標不合法' })
      }
      if (!location) {
        return res.status(400).send({ message: '未附上地點'})
      }
      if (address === undefined) {
        return res.status(400).send({ message: '未附上地址' })
      }

      // 加入足跡
      const footprints = Array.from(req.user.footprints)
      footprints.push({
        longitude,
        latitude,
        location,
        address,
        time: new Date().toISOString()
      })
      await users.doc(req.user.id).update({ footprints })
      return res.status(200).send({ footprints })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  }
}

module.exports = userController