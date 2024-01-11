import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import User from '../../models/User.js'
import countries from '../../utils/countries.js'
import { nativeNames } from '../../utils/languages.js'

export const registerValidation = async (req, res) => {
  const schemaRegister = Joi.object({
    username: Joi.string().min(6).max(20).required().label('Username'),
    email: Joi.string().min(6).max(100).required().email().label('Email'),
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
    nationality: Joi.string().valid(...countries).label('Nationality'),
    languages: Joi.array().items(Joi.string().valid(...nativeNames)).label('Languages'),
    visitedCountries: Joi.array().items(Joi.string().valid(...countries)).label('Visited Countries')
  })

  const { error } = schemaUpdateProfile.validate(req.body)

  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  if (!error) return res.status(200)
}

export const completeProfileValidation = async (req, res) => {
  const schemaUpdateProfile = Joi.object({
    name: Joi.string().min(2).max(50).required().label('Name'),
    lastName: Joi.string().min(3).max(50).required().label('Last Name'),
    description: Joi.string().max(550).required().label('Description'),
    birthDate: Joi.date().max('now').iso().required().label('Birth Date'),
    nationality: Joi.string().valid(...countries).required().label('Nationality'),
    languages: Joi.array().items(Joi.string().valid(...nativeNames)).required().label('Languages'),
    visitedCountries: Joi.array().items(Joi.string().valid(...countries)).required().label('Visited Countries')
  })

  const { error } = schemaUpdateProfile.validate(req.body)

  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  if (!error) return res.status(200)
}
