import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Session from '../models/session.js'

import { registerValidation, loginValidation, refreshTokenValidation } from './validations/userValidation.js'

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
          return res
            .status(200)
            .json({ error: null, message: 'Logged Out Sucessfully' })
        }

        await session.deleteOne()
        res.status(200).json({ error: null, message: 'Logged Out Sucessfully' })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
