const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('../service-account-key.json')
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://project-meichu.firebaseio.com'
})

const db = firebaseAdmin.firestore()
module.exports = db