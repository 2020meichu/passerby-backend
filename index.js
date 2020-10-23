const express = require('express')
const app = express()
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('./service-account-key.json')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://project-meichu.firebaseio.com'
})
const db = firebaseAdmin.firestore()
const users = db.collection('users')

const testUser = {
  name: 'Test1',
  age: 22,
  gender: 'male'
}

app.post('/user', async (req, res) => {
  await users.doc('test1').set(testUser)
  return res.status(200).send({
    message: 'successfully add user!'
  })
})

app.patch('/user', async (req, res) => {
  await users.doc('test1').update({
    name: 'Test1'
  })
  return res.status(200).send({
    message: 'successfully update user!'
  })
})

app.get('*', (req, res) => {
  res.status(200).send({
    message: 'hello world'
  })
})

app.listen(3000, () => {
  console.log('listening...')
})