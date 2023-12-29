// config.js
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
  path: path.resolve(__dirname, '.env.' + process.env.NODE_ENV)
})

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  MONGO_HOST: process.env.MONGO_HOST
}
