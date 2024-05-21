import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import User from '../../models/User.js'
import countries from '../../utils/countries.js'

export const registerValidation = async (req, res) => {
  const today = new Date()
  const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
  const maxAgeDate = new Date(today.getFullYear() - 130, today.getMonth(), today.getDate())

  const schemaRegister = Joi.object({
    username: Joi.string().trim().pattern(/^[a-z0-9_]+$/).min(6).max(20).required().label('Username').messages({ 'string.pattern.base': 'username can only contain lowercase letters, digits and underscores.' }),
    email: Joi.string().trim().min(6).max(100).required().email().label('Email'),
    password: Joi.string().trim().min(8).max(1024).required().label('Password'),
    birthDate: Joi.date().max(minAgeDate).min(maxAgeDate).required().label('Birth Date').messages({
      'date.max': 'You must be at least 16 years old.',
      'date.min': 'You must be at most 130 years old.'
    }),
    city: Joi.string().trim().max(30).required().label('City'),
    country: Joi.string().trim().valid(...countries).required().label('Country')
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
    email: Joi.string().min(6).max(100).required().email().label('Email'),
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

export const updateProfileValidation = async (req, res) => {
  const schemaUpdateProfile = Joi.object({
    name: Joi.string().min(2).max(50).label('Name'),
    lastName: Joi.string().min(3).max(50).label('Last Name'),
    description: Joi.string().max(550).label('Description'),
    birthDate: Joi.date().max('now').iso().label('Birth Date'),
    country: Joi.string().valid(...countries).label('Country'),
    city: Joi.string().max(30).label('City')
  })

  const { error } = schemaUpdateProfile.validate(req.body)

  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  if (!error) return res.status(200)
}
