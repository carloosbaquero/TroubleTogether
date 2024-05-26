import config from '../config.js'
import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import travelRoutes from './routes/travelRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())
app.use(cors([`${config.HOST_DIR}`]))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose.connect(config.MONGO_HOST)

console.log(`NODE_ENV=${config.NODE_ENV}`)

app.use('/api/users', userRoutes)
app.use('/api/travels', travelRoutes)
app.use('/api/requests', requestRoutes)
app.use('/public/profPic', express.static(`${__dirname}/public/profPic`))
app.use('/public/posts', express.static(`${__dirname}/public/posts`))
console.log(`${__dirname}/public/posts`)

app.listen(config.PORT, config.HOST, function () {
  console.log(`App listening on http://${config.HOST}:${config.PORT}`)
})

export default app
