import jwt from 'jsonwebtoken'

export const isLogged = async (req, res, next) => {
  let token = req.header('Authorization')
  if (!token) {
    return res
      .status(403)
      .json({ error: 'Access Denied: No token provided' })
  }
  const typeToken = token.split(' ')[0]

  if (typeToken === 'Bearer') {
    token = token.replace('Bearer ', '')
  } else {
    return res
      .status(403)
      .json({ error: 'Access Denied: Invalid token' })
  }

  try {
    const tokenDetails = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    )
    req.user = tokenDetails
    next()
  } catch (err) {
    console.log(err)
    res
      .status(403)
      .json({ error: 'Access Denied: Invalid token' })
  }
}

export const roleCheck = (roles) => {
  return (req, res, next) => {
    roles.push('user')
    if (req.user.roles.includes(...roles)) {
      next()
    } else {
      res.status(403).json({ error: 'You are not authorized' })
    }
  }
}
