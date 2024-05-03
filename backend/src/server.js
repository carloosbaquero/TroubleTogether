import config from '../config.js'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import historyApiFallback from 'connect-history-api-fallback'
import userRoutes from './routes/userRoutes.js'
import travelRoutes from './routes/travelRoutes.js'
import requestRoutes from './routes/requestRoutes.js'

const app = express()
app.use(express.json())
app.use(cors(['http://localhost:3000', 'https://backend-globetrotters.onrender.com']))

mongoose.connect(config.MONGO_HOST)

console.log(`NODE_ENV=${config.NODE_ENV}`)

app.use('/api/users', userRoutes)
app.use('/api/travels', travelRoutes)
app.use('/api/requests', requestRoutes)
app.use(historyApiFallback())

app.listen(config.PORT, config.HOST, function () {
  console.log(`App listening on http://${config.HOST}:${config.PORT}`)
})

export default app
