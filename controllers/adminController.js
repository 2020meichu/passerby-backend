const bcrypt = require('bcrypt')
const passport = require('../config/passport/passport')
const issueToken = require('../utils/issueToken')
const db = require('../model/db')
const adminCollection = db.collection('admins')
const diseaseCollection = db.collection('diseases')
const regionCollection = db.collection('regions')
const ruleCollection = db.collection('rules')
const userCollection = db.collection('users')
const getAllDocuments = require('../utils/getAllDocuments')
const sortDocumentsById = require('../utils/sortDocumentsById')

/**
 * 
 * @param {{diseases: Object, regions: Object, quarantine: Int}} rules 
 */
async function checkRules (rules) {
  const { diseases, regions, quarantine } = rules
  // check 疾病設定
  if (diseases) {
    let diseaseIds = Object.keys(diseases)
    for (let i = 0; i < diseaseIds.length; i++) {
      let disease = await (await diseaseCollection.doc(diseaseIds[i]).get()).data()
      if (!disease) {
        throw new Error('disease not exists')
      }
    }
  }
  // check 地區設定
  if (regions) {
    let regionIds = Object.keys(regions)
    for (let i = 0; i < regionIds.length; i++) {
      let region = await (await regionCollection.doc(regionIds[i]).get()).data()
      if (!region) {
        throw new Error('region not exists')
      }
    }
  }
  // check 隔離天數設定
  if (quarantine !== undefined) {
    console.log(quarantine)
    if (!Number.isInteger(quarantine)) {
      throw new Error('quarantine must be positive integer')
    } else if (quarantine <= 0) {
      throw new Error('quarantine must be positive integer')
    }
  }
}

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
  async addDisease (req, res) {
    try {
      // 檢查參數
      const { name } = req.body
      if (!name) {
        return res.status(400).send({ message: '未附上疾病名稱' })
      }

      // 檢查疾病名稱是否重複
      const allDiseases = await getAllDocuments('diseases')
      if (allDiseases.some(d => d.name === name)) {
        return res.status(403).send({ message: '疾病名稱重複' })
      }

      // 新增疾病並回傳新疾病列表
      const newDisease = {
        id: allDiseases.length+1,
        name: name
      }
      await diseaseCollection.doc(String(newDisease.id)).set(newDisease)
      allDiseases.push(newDisease)
      return res.status(200).send({ diseases: sortDocumentsById(allDiseases) })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async updateDisease (req, res) {
    try {
      // 檢查參數
      const { id, name } = req.body
      if (!id) {
        return res.status(400).send({ message: '未附上疾病 id' })
      }
      if (!name) {
        return res.status(400).send({ message: '未附上疾病名稱' })
      }

      const allDiseases = await getAllDocuments('diseases')
      // 檢查疾病名稱是否重複
      if (allDiseases.some(d => d.name === name)) { 
        return res.status(403).send({ message: '疾病名稱重複' })
      }
      // 檢查疾病 id 是否存在
      let diseaseIndex = allDiseases.findIndex(d => d.id === id)
      if (diseaseIndex === -1) {
        return res.status(403).send({ message: '無此疾病 id' })
      } else {
        allDiseases[diseaseIndex].name = name
      }

      // 更新疾病並回傳
      await diseaseCollection.doc(String(id)).update({ name })
      return res.status(200).send({ diseases: sortDocumentsById(allDiseases) })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async addRegion (req, res) {
    try {
      // 檢查參數
      const { name, code } = req.body
      if (!name) {
        return res.status(400).send({ message: '未附上地區名稱' })
      }
      if (!code) {
        return res.status(400).send({ message: '未附上地區代碼' })
      }

      // 檢查地區名稱＆代碼是否重複
      const allRegions = await getAllDocuments('regions')
      if (allRegions.some(d => d.name === name || d.code === code)) {
        return res.status(403).send({ message: '地區名稱或是代碼重複' })
      }

      // 新增地區並回傳新地區列表
      const newRegion = {
        id: allRegions.length+1,
        name,
        code
      }
      await regionCollection.doc(String(newRegion.id)).set(newRegion)
      allRegions.push(newRegion)
      return res.status(200).send({ regions: sortDocumentsById(allRegions) })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async updateRegion (req, res) {
    try {
      // 檢查參數
      const { id, name, code } = req.body
      if (!id) {
        return res.status(400).send({ message: '未附上地區 id' })
      }
      if (!name) {
        return res.status(400).send({ message: '未附上地區名稱' })
      }
      if (!code) {
        return res.status(400).send({ message: '未附上地區代碼' })
      }

      const allRegions = await getAllDocuments('regions')
      // 檢查地區名稱＆代碼是否重複
      if (allRegions.some(r => (r.name === name || r.code === code) && r.id !== id)) {
        return res.status(403).send({ message: '地區名稱或代碼重複' })
      }
      // 檢查地區 id 是否存在
      let regionIndex = allRegions.findIndex(r => r.id === id)
      if (regionIndex === -1) {
        return res.status(403).send({ message: '無此地區 id' })
      } else {
        allRegions[regionIndex].name = name
        allRegions[regionIndex].code = code
      }

      // 更新疾病並回傳
      await regionCollection.doc(String(id)).update({ name, code })
      return res.status(200).send({ diseases: sortDocumentsById(allRegions) })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async getUserById (req, res) {
    try {
      const { id } = req.params
      const user = await (await userCollection.doc(String(id)).get()).data()
      if (!user) {
        return res.status(404).send({ message: '無此使用者' })
      }
      return res.status(200).send({ user })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async getLightRules (req, res) {
    try {
      const redLightRule = await (await ruleCollection.doc('red').get()).data()
      const yellowLightRule = await (await ruleCollection.doc('yellow').get()).data()
      return res.status(200).send({
        rules: {
          red: redLightRule,
          yellow: yellowLightRule
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  async setLightRules (req, res) {
    try {
      const { red, yellow } = req.body.rules
      if (red) {
        console.log(red)
        await checkRules(red)
        await ruleCollection.doc('red').set({ light: 'red', ...red })
      }
      if (yellow) {
        await checkRules(yellow)
        await ruleCollection.doc('yellow').set({ light: 'yellow', ...yellow })
      }
      const newRedLightRule = await (await ruleCollection.doc('red').get()).data()
      const newYellowLightRule = await (await ruleCollection.doc('yellow').get()).data()
      return res.status(200).send({
        rules: {
          red: newRedLightRule,
          yellow: newYellowLightRule
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  }
}

module.exports = adminController