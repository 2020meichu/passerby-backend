const db = require('../model/db')

module.exports = async (collectionId) => {
  const snapshot = await db.collection(collectionId).get()
  return snapshot.docs.map(doc => doc.data())
}
