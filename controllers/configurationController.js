const db = require('../model/db')

async function getAllDocuments (collectionId) {
  const snapshot = await db.collection(collectionId).get()
  return snapshot.docs.map(doc => doc.data())
}

function sortDocumentsById (documents) {
  return documents.sort((prev, next) => prev.id - next.id)
}

const configurationController = {
  async getConfiguration (req, res) {
    try {
      // 取得疾病＆地區資料
      let diseases = await getAllDocuments('diseases')
      diseases = sortDocumentsById(diseases)
      let regions = await getAllDocuments('regions')
      regions = sortDocumentsById(regions)

      // 取得紅燈＆黃燈規則資料
      const ruleCollection = db.collection('rules')
      let redLightRules = await (await ruleCollection.doc('red').get()).data()
      let yellowLightRules = await (await ruleCollection.doc('yellow').get()).data()

      // 回傳所有資料
      return res.status(200).send({ 
        diseases,
        regions,
        rules: {
          red: redLightRules,
          yellow: yellowLightRules
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  }
}

module.exports = configurationController