import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Session from '../models/session.js'

import { registerValidation, loginValidation, refreshTokenValidation, updateProfileValidation, completeProfileValidation } from './validations/userValidation.js'

import { generateTokens, verifyRefreshToken } from '../utils/utils.js'

export const register = async (req, res) => {
  try {
    registerValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)

        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password
        })
        try {
          const savedUser = await user.save()
          res.status(201).json({
            error: null,
            data: savedUser
          })
        } catch (error) {
          console.log(error)
          res.status(401).json({ error })
        }
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const login = async (req, res) => {
  try {
    loginValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        const user = await User.findOne({ email: req.body.email })

        const { accessToken, refreshToken } = await generateTokens(user)
        res.status(200).json({
          error: null,
          data: {
            accessToken,
            refreshToken
          },
          message: 'Logged in sucessfully'
        })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getNewAccessToken = async (req, res) => {
  try {
    refreshTokenValidation(req, res).then((res) => {
      if (res.statusCode === 200) {
        verifyRefreshToken(req, res).then((result) => {
          const payload = { _id: result.data._id, roles: result.data.roles }
          const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: '14m' }
          )
          res.status(200).json({
            error: null,
            data: {
              accessToken
            },
            message: 'Access token created successfully'
          })
        })
          .catch((err) => res.status(400).json({ error: err.message }))
      } else {
        return res
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const logout = async (req, res) => {
  try {
    refreshTokenValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        const session = await Session.findOne({ token: req.body.refreshToken })
        if (!session) {
          console.log('hola')
          return res
            .status(200)
            .json({ error: null, message: 'Logged Out Sucessfully' })
        }
        console.log(session)

        await session.deleteOne()
        res.status(200).json({ error: null, message: 'Logged Out Sucessfully' })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const completeProfile = async (req, res) => {
  try {
    completeProfileValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        try {
          const user = await User.findById(req.user._id)
          user.name = req.body.name
          user.lastName = req.body.lastName
          user.description = req.body.description
          user.birthDate = req.body.birthDate
          user.nationality = req.body.nationality
          user.languages = req.body.languages
          user.visitedCountries = req.body.visitedCountries

          const savedUser = await user.save()

          res.status(201).json({
            error: null,
            data: savedUser
          })
        } catch (error) {
          console.log(error)
          res.status(401).json({ error })
        }
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    updateProfileValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        try {
          const user = await User.findById(req.user._id)
          user.name = req.body.name ? req.body.name : user.name
          user.lastName = req.body.lastName ? req.body.lastName : user.lastName
          user.description = req.body.description ? req.body.description : user.description
          user.birthDate = req.body.birthDate ? req.body.birthDate : user.birthDate
          user.nationality = req.body.nationality ? req.body.nationality : user.nationality
          user.languages = req.body.languages ? req.body.languages : user.languages
          user.visitedCountries = req.body.visitedCountries ? req.body.visitedCountries : user.visitedCountries

          const savedUser = await user.save()

          res.status(201).json({
            error: null,
            data: savedUser
          })
        } catch (error) {
          console.log(error)
          res.status(401).json({ error })
        }
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
