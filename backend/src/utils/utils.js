import jwt from 'jsonwebtoken'
import Session from '../models/session.js'

export const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, roles: user.roles }
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: '14m' }
    )
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: '1d' }
    )

    const session = await Session.findOne({ userId: user._id })
    if (session) await session.deleteOne()

    await new Session({ userId: user._id, token: refreshToken }).save()
    return Promise.resolve({ accessToken, refreshToken })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const verifyRefreshToken = async (req) => {
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY

  return new Promise((resolve, reject) => {
    const session = Session.findOne({ token: req.body.refreshToken })

    if (!session) {
      return reject(new Error('Invalid refresh token'))
    } else {
      jwt.verify(req.body.refreshToken, privateKey, (err, tokenDetails) => {
        if (err) return reject(new Error('Invalid refresh token'))

        return resolve({
          data: {
            tokenDetails
          },
          error: null,
          message: 'Valid refresh token'
        })
      })
    }
  })
}
