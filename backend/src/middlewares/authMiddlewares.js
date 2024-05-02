import jwt from 'jsonwebtoken'
import PlannedTravel from '../models/plannedTravel.js'

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

export const isOrganizer = async (req, res, next) => {
  try {
    const userId = req.user._id
    const travel = await PlannedTravel.findById(req.params.id)

    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' })
    }

    if (travel.organizerId.toString() === userId) {
      next()
    } else {
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const isParticipant = async (req, res, next) => {
  try {
    const userId = req.user._id
    const travel = await PlannedTravel.findById(req.params.id)

    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' })
    }

    if (travel.organizerId.toString() === userId || travel.atendees.some(atendee => atendee.toString() === userId)) {
      next()
    } else {
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const isNotParticipant = async (req, res, next) => {
  try {
    const userId = req.user._id
    const travel = await PlannedTravel.findById(req.params.id)

    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' })
    }

    if (!(travel.organizerId.toString() === userId || travel.atendees.some(atendee => atendee.toString() === userId))) {
      next()
    } else {
      return res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const isTravelPlanningAndNotFull = async (req, res, next) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id)

    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' })
    }

    if (travel.state !== 'Planning' || travel.maxAtendees <= travel.atendees.length + 1) {
      return res.status(403).json({ error: 'Forbidden' })
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
