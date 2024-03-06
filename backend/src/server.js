import config from '../config.js'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import userRoutes from './routes/userRoutes.js'
import travelRoutes from './routes/travelRoutes.js'

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(config.MONGO_HOST)

console.log(`NODE_ENV=${config.NODE_ENV}`)

app.use('/api/users', userRoutes)
app.use('/api/travels', travelRoutes)

app.listen(config.PORT, config.HOST, function () {
  console.log(`App listening on http://${config.HOST}:${config.PORT}`)
})
