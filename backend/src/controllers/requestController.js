import PlannedTravel from '../models/plannedTravel.js'
import Request from '../models/request.js'

export const createRequest = async (req, res) => {
  try {
    const userId = req.user._id
    const travel = await PlannedTravel.findById(req.params.id).populate('requests')

    if (travel.requests && travel.requests.length > 0) {
      const userExistsInRequests = travel.requests.some(request => request.user.toString() === userId.toString())

      if (userExistsInRequests) {
        return res.status(403).json({ error: 'Forbidden' })
      }
    }

    const request = new Request({
      user: userId,
      travel: travel._id
    })

    const savedRequest = await request.save()

    travel.requests.push(savedRequest._id)
    await travel.save()

    res.status(201).json({ error: null, message: 'Your request was sent successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getTravelRequests = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id).populate('requests')
    const requests = travel.requests.filter(r => r.rejected === false && r.approved === false)

    res.status(200).json({ error: null, data: requests })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const acceptRequest = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id)
    const request = await Request.findById(req.params.requestId)

    if (!request) {
      return res.status(404).json({ error: 'Not Found' })
    }

    if (request.approved === true || request.rejected === true) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    request.approved = true
    await request.save()

    travel.atendees.push(request.user)
    await travel.save()

    res.status(200).json({ error: null, message: 'User`s request was approved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId)

    if (!request) {
      return res.status(404).json({ error: 'Not Found' })
    }

    if (request.approved === true || request.rejected === true) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    request.rejected = true
    await request.save()

    res.status(200).json({ error: null, message: 'User`s request was rejected' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
