import Destination from '../models/destination.js'
import PlannedTravel from '../models/plannedTravel.js'
import countries from '../utils/countries.js'
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

export const getTravels = async (req, res) => {
  const now = new Date()
  const twoYearsLater = new Date(now)
  twoYearsLater.setFullYear(now.getFullYear() + 2)
  try {
    const page = parseInt(req.query.page) - 1 || 0
    const limit = 10
    const search = req.query.search || ''
    let sort = req.query.sort || 'startDate'
    let country = req.query.country || 'All'
    const start = req.query.startDate || now
    const end = req.query.endDate || twoYearsLater

    country === 'All'
      ? (country = [...countries])
      : (country = req.query.country.split(','))
    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort])

    const sortBy = {}
    if (sort[1]) {
      sortBy[sort[0]] = sort[1]
    } else {
      sortBy[sort[0]] = 'asc'
    }

    const removeAccents = (str) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    const searchNoAccents = removeAccents(search)

    const destinations = await Destination.find({ city: { $regex: searchNoAccents, $options: 'i' } })
      .where('country')
      .in([...country])

    const listDestinations = destinations.map(destination => destination._id)

    const travels = await PlannedTravel.find({
      destination: { $in: listDestinations },
      state: 'Planning',
      startDate: { $gte: start },
      endDate: { $lte: end },
      $expr: { $lt: [{ $size: '$atendees' }, '$maxAtendees'] }
    })
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)

    const total = travels.length

    const response = {
      error: null,
      total,
      page: page + 1,
      limit,
      travels
    }

    res.status(200).json(response)
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
