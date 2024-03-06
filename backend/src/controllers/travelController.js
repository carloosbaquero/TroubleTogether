import Destination from '../models/destination.js'
import PlannedTravel from '../models/plannedTravel.js'
import { createTravelValidation } from './validations/travelValidation.js'

export const createTravel = async (req, res) => {
  try {
    const userId = req.user._id

    createTravelValidation(req, res).then(async (res) => {
      try {
        if (res.statusCode !== 200) {
          return res
        } else {
          const destinations = req.body.destinations
          const destinationsId = []
          for (let i = 0; i < destinations.length; i++) {
            const newDest = new Destination({
              city: req.body.destinations[i].city,
              country: req.body.destinations[i].country,
              startDate: req.body.destinations[i].startDest,
              endDate: req.body.destinations[i].endDest
            })

            const savedDest = await newDest.save()
            destinationsId.push(savedDest._id)
          }

          const newTravel = new PlannedTravel({
            organizerId: userId,
            name: req.body.name,
            description: req.body.description,
            destination: destinationsId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            maxAtendees: req.body.maxAtendees,
            minAtendees: req.body.minAtendees
          })

          const savedTravel = await newTravel.save()

          res.status(201).json({
            error: null,
            data: savedTravel
          })
        }
      } catch (error) {
        console.log(error)
        res.status(401).json({ error })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getTravelInfo = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id)
    if (travel.state === 'Planning' && travel.maxAtendees > travel.atendees.length) {
      res.status(200).json(travel)
    } else if (travel.state === 'Completed') {
      res.status(200).json(travel)
    } else {
      res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: 'Page not found' })
  }
}

export const getTravelDashboard = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id)
    const userId = req.user._id

    console.log(userId)
    console.log(travel)

    if (travel.organizerId.toString() === userId || travel.atendees.some(atendee => atendee.toString() === userId)) {
      res.status(200).json(travel)
    } else {
      res.status(403).json({ error: 'Forbidden' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
