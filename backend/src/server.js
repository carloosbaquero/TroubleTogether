const config = require('../config.js')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(config.MONGO_HOST)

console.log(`NODE_ENV=${config.NODE_ENV}`)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(config.PORT, config.HOST, function () {
  console.log(`App listening on http://${config.HOST}:${config.PORT}`)
})
