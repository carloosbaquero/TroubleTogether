import Destination from '../models/destination.js'
import PlannedTravel from '../models/plannedTravel.js'
import countries from '../utils/countries.js'
import { createDestinationValidation, createTravelValidation, updateDestinationValidation, updateTravelValidation } from './validations/travelValidation.js'

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
          if (destinations) {
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
  twoYearsLater.setFullYear(now.getFullYear() + 3)
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
      $or: [
        { name: { $regex: searchNoAccents, $options: 'i' } },
        { description: { $regex: searchNoAccents, $options: 'i' } },
        { destination: { $in: listDestinations } }
      ],
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
      data: travels
    }

    res.status(200).json(response)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getTravelInfo = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id).populate('destination').populate('organizerId').populate('atendees')

    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' })
    }

    if (travel.state === 'Planning' && travel.maxAtendees > travel.atendees.length) {
      res.status(200).json({ error: null, data: travel })
    } else if (travel.state === 'Completed') {
      res.status(200).json({ error: null, data: travel })
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
    const travel = await PlannedTravel.findById(req.params.id).populate('destination').populate('organizerId').populate('atendees')

    res.status(200).json({ error: null, data: travel })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateTravel = async (req, res) => {
  try {
    const travelId = req.params.id
    const travel = await PlannedTravel.findById(travelId).populate('destination')

    updateTravelValidation(req, res, travel).then(async (res) => {
      try {
        if (res.statusCode !== 200) {
          return res
        } else {
          travel.name = req.body.name ? req.body.name : travel.name
          travel.description = req.body.description ? req.body.description : travel.description
          travel.startDate = req.body.startDate ? req.body.startDate : travel.startDate
          travel.endDate = req.body.endDate ? req.body.endDate : travel.endDate
          travel.maxAtendees = req.body.maxAtendees ? req.body.maxAtendees : travel.maxAtendees
          travel.minAtendees = req.body.minAtendees ? req.body.minAtendees : travel.minAtendees
          travel.state = req.body.state ? req.body.state : travel.state

          const savedTravel = await travel.save()
          res.status(200).json({
            error: null,
            data: savedTravel
          })
        }
      } catch (error) {
        console.log(error)
        res.status(404).json({ error: 'Page not found' })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteTravel = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id)
    await travel.deleteOne()
    res.status(200).json({ error: null, message: 'Travel deleted successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const addDestination = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id).populate('destination')
    createDestinationValidation(req, res, travel).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        const newDest = new Destination({
          city: req.body.city,
          country: req.body.country,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          hotel: req.body.hotel
        })

        const destSaved = await newDest.save()
        const destId = destSaved._id
        travel.destination.push(destId)
        const travelSaved = await travel.save()

        res.status(201).json({
          error: null,
          data: travelSaved
        })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateDestination = async (req, res) => {
  try {
    const travel = await PlannedTravel.findById(req.params.id).populate('destination')
    const dest = await Destination.findById(req.params.destId)
    updateDestinationValidation(req, res, travel).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        dest.city = req.body.city ? req.body.city : dest.city
        dest.country = req.body.country ? req.body.country : dest.description
        dest.startDate = req.body.startDate ? req.body.startDate : dest.startDate
        dest.endDate = req.body.endDate ? req.body.endDate : dest.endDate
        dest.hotel = req.body.hotel ? req.body.hotel : dest.hotel

        const destSaved = await dest.save()

        res.status(201).json({
          error: null,
          data: destSaved
        })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
export const deleteDestination = async (req, res) => {
  try {
    const travelId = req.params.id
    const destinationId = req.params.destId

    const updatedTravel = await PlannedTravel.findByIdAndUpdate(
      travelId,
      { $pull: { destination: destinationId } },
      { new: true }
    )

    const deletedDestination = await Destination.findByIdAndDelete(destinationId)
    if (!deletedDestination) {
      return res.status(404).json({ error: 'Destination not found' })
    }

    res.status(200).json({ message: 'Destination and reference removed successfully', updatedTravel })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
