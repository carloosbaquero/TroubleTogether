import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '.env.' + process.env.NODE_ENV)
})

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  HOST_DIR: process.env.HOST_DIR || 'http://localhost:3000',
  PORT: process.env.PORT || 3000,
  MONGO_HOST: process.env.MONGO_HOST
}
