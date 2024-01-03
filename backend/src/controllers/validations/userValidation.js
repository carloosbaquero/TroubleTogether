import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import User from '../../models/user.js'

export const registerValidation = async (req, res) => {
  const schemaRegister = Joi.object({
    username: Joi.string().min(6).max(30).required().label('Username'),
    email: Joi.string().min(6).max(254).required().email().label('Email'),
    password: Joi.string().min(8).max(1024).required().label('Password')
  })

  const { error } = schemaRegister.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  const isEmailExist = await User.findOne({ email: req.body.email })
  if (isEmailExist) {
    return res.status(401).json(
      { error: 'Email is already registered' }
    )
  }

  const isUsernameExist = await User.findOne({ username: req.body.username })
  if (isUsernameExist) {
    return res.status(401).json(
      { error: 'Username already exists' }
    )
  }

  if (!error && !isEmailExist && !isUsernameExist) {
    return res.status(200)
  }
}

export const loginValidation = async (req, res) => {
  const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(254).required().email().label('Email'),
    password: Joi.string().min(8).max(1024).required().label('Password')
  })

  const { error } = schemaLogin.validate(req.body)

  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(401).json({ error: 'User not found' })

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(401).json({ error: 'Password is not valid' })

  if (!error && user && validPassword) return res.status(200)
}

export const refreshTokenValidation = async (req, res) => {
  const schemaRefreshToken = Joi.object({
    refreshToken: Joi.string().required().label('Refresh Token')
  })
  const { error } = schemaRefreshToken.validate(req.body)

  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  if (!error) return res.status(200)
}
