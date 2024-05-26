import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Session from '../models/session.js'
import { registerValidation, loginValidation, refreshTokenValidation, updateProfileValidation } from './validations/userValidation.js'
import { generateTokens, verifyRefreshToken } from '../utils/utils.js'
import PlannedTravel from '../models/plannedTravel.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Post from '../models/post.js'

export const register = async (req, res) => {
  try {
    registerValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password.trim(), salt)

        const user = new User({
          username: req.body.username.trim(),
          email: req.body.email.trim(),
          password,
          birthDate: req.body.birthDate,
          city: req.body.city.trim(),
          country: req.body.country
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
        const user = await User.findOne({ email: req.body.email.trim() })

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
          const payload = { _id: result.data.tokenDetails._id, roles: result.data.tokenDetails.roles }
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

export const whoAmI = async (req, res) => {
  let token = req.header('Authorization')
  let notLogged = false
  let userId
  let username

  if (!token) {
    notLogged = true
  } else {
    const typeToken = token.split(' ')[0]
    if (typeToken === 'Bearer') {
      token = token.replace('Bearer ', '')
      try {
        const tokenDetails = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_PRIVATE_KEY
        )
        req.user = tokenDetails
      } catch (err) {
        notLogged = true
      }
    } else {
      notLogged = true
    }
  }

  if (notLogged) {
    userId = ''
    username = ''
  } else {
    userId = req.user._id
    username = await User.findById(req.user._id)
  }

  res.status(200).json({ error: null, data: { userId, username: username?.username || '', profPic: username?.profPic || '' } })
}

export const myProffile = async (req, res) => {
  const userId = req.user._id
  try {
    const user = await User.findById(userId)
    const travelsOrganizing = await PlannedTravel.find({ organizerId: userId }).populate('destination').populate('organizerId').sort({ startDate: 'asc' })
    const travelsAtending = await PlannedTravel.find({ atendees: { $in: [userId] } }).populate('destination').populate('organizerId').sort({ startDate: 'asc' })
    const posts = await Post.find({ user: userId }).populate('likes').populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user' }
      })
      .sort({ createdAt: 'desc' })

    return res.status(200).json({ error: null, data: { user, travelsOrganizing, travelsAtending, posts } })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getProffile = async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const travelsOrganizing = await PlannedTravel.find({ organizerId: userId }).populate('destination').populate('organizerId').sort({ startDate: 'asc' })
    const travelsAtending = await PlannedTravel.find({ atendees: { $in: [userId] } }).populate('destination').populate('organizerId').sort({ startDate: 'asc' })
    const posts = await Post.find({ user: userId }).populate('likes').populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user' }
      })
      .sort({ createdAt: 'desc' })

    return res.status(200).json({ error: null, data: { user, travelsOrganizing, travelsAtending, posts } })
  } catch (err) {
    console.log(err)
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
          user.country = req.body.country ? req.body.country : user.country
          user.city = req.body.city ? req.body.city : user.city
          if (req.file) {
            const { filename } = req.file

            if (user.profPic) {
              const __filename = fileURLToPath(import.meta.url)
              const __dirname = path.dirname(__filename)
              const profPic = user.profPic.split('/').at(-1)
              const oldFilePath = path.join(__dirname, '..', 'public', 'profPic', profPic)
              console.log(oldFilePath)
              fs.unlink(oldFilePath, (err) => {
                if (err) {
                  console.error('Error while deleting old image:', err)
                } else {
                  console.log('Old image successfully deleted')
                }
              })
            }
            user.setProfPic(filename)
          }

          const savedUser = await user.save()

          res.status(200).json({
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

export const searchUsersAndPosts = async (req, res) => {
  try {
    const search = req.query.search

    const removeAccents = (str) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    const searchNoAccents = removeAccents(search)

    const users = await User.find({ username: { $regex: searchNoAccents, $options: 'i' } })
    const userIds = users.map(user => user._id)
    const posts = await Post.find({ user: { $in: userIds } }).populate('user').populate('likes')
      .populate({
        path: 'comments',
        populate: { path: 'user' }
      })
      .sort({ createdAt: 'desc' })

    return res.status(200).json({ error: null, data: { users, posts } })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
