import ApprovationSugestion from '../models/approvationSugestion.js'
import DailyItinerary from '../models/dailyItinerary.js'
import Destination from '../models/destination.js'
import PlannedTravel from '../models/plannedTravel.js'
import Suggestion from '../models/suggestion.js'
import countries from '../utils/countries.js'
import { addDailyItineraryValidation, addSuggestionValidation, createDestinationValidation, createTravelValidation, updateDailyItineraryValidation, updateDestinationValidation, updateTravelValidation } from './validations/travelValidation.js'

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

    let total = await PlannedTravel.find({
      $or: [
        { name: { $regex: searchNoAccents, $options: 'i' } },
        { description: { $regex: searchNoAccents, $options: 'i' } },
        { destination: { $in: listDestinations } }
      ],
      destination: { $in: listDestinations },
      state: 'Planning',
      startDate: { $gte: start },
      endDate: { $lte: end },
      $expr: { $lt: [{ $size: '$atendees' }, '$maxAtendees'] }
    }).populate('destination')

    total = total.length

    const travels = await PlannedTravel.find({
      $or: [
        { name: { $regex: searchNoAccents, $options: 'i' } },
        { description: { $regex: searchNoAccents, $options: 'i' } },
        { destination: { $in: listDestinations } }
      ],
      destination: { $in: listDestinations },
      state: 'Planning',
      startDate: { $gte: start },
      endDate: { $lte: end },
      $expr: { $lt: [{ $size: '$atendees' }, '$maxAtendees'] }
    }).populate('destination')
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)

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
    const travel = await PlannedTravel.findById(req.params.id).populate('destination').populate('organizerId').populate('atendees').populate('requests')

    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' })
    }

    if (travel.state === 'Planning' && travel.maxAtendees > travel.atendees.length) {
      res.status(200).json({ error: null, data: travel })
    } else if (travel.state === 'Planned') {
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
    const travel = await PlannedTravel.findById(req.params.id).populate('destination').populate('organizerId').populate('atendees').populate('itinerary')
      .populate({
        path: 'suggestions',
        populate: { path: 'user' }
      })
      .populate({
        path: 'suggestions',
        populate: { path: 'approvations' }
      })
      .populate({
        path: 'requests',
        populate: { path: 'user' }
      })

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

        await travel.save()

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

    res.status(200).json({ error: null, message: 'Destination and reference removed successfully', updatedTravel })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const addDailyItinerary = async (req, res) => {
  try {
    const travelId = req.params.id
    const travel = await PlannedTravel.findById(travelId)

    addDailyItineraryValidation(req, res, travel).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        const newItinerary = new DailyItinerary({
          itinerary: req.body.itinerary,
          date: req.body.date
        })

        const savedItinerary = await newItinerary.save()

        travel.itinerary.push(savedItinerary._id)
        await travel.save()
        res.status(201).json({ error: null, data: savedItinerary })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateDailyItinerary = async (req, res) => {
  try {
    const travelId = req.params.id
    const itineraryId = req.params.itId
    const travel = await PlannedTravel.findById(travelId)
    const dailyItinerary = await DailyItinerary.findById(itineraryId)

    updateDailyItineraryValidation(req, res, travel, itineraryId).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        dailyItinerary.itinerary = req.body.itinerary
        dailyItinerary.date = req.body.date

        const savedItinerary = await dailyItinerary.save()

        await travel.save()
        res.status(201).json({ error: null, data: savedItinerary })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteDailyItinerary = async (req, res) => {
  try {
    const travelId = req.params.id
    const itineraryId = req.params.itId

    const updatedTravel = await PlannedTravel.findByIdAndUpdate(
      travelId,
      { $pull: { itinerary: itineraryId } },
      { new: true }
    )

    const deletedDailyItinerary = await DailyItinerary.findByIdAndDelete(itineraryId)
    if (!deletedDailyItinerary) {
      return res.status(404).json({ error: 'Daily itinerary not found' })
    }

    res.status(200).json({ error: null, message: 'Daily itinerary and reference removed successfully', updatedTravel })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const addSuggestion = async (req, res) => {
  try {
    const travelId = req.params.id
    const userId = req.user._id
    const travel = await PlannedTravel.findById(travelId)

    addSuggestionValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        const newSuggestion = new Suggestion({
          description: req.body.description,
          user: userId
        })

        const savedSuggestion = await newSuggestion.save()

        travel.suggestions.push(savedSuggestion._id)
        await travel.save()
        res.status(201).json({ error: null, data: savedSuggestion })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateSuggestion = async (req, res) => {
  try {
    const travelId = req.params.id
    const suggestionId = req.params.sugId
    const travel = await PlannedTravel.findById(travelId)
    const suggestion = await Suggestion.findById(suggestionId)

    addSuggestionValidation(req, res).then(async (res) => {
      if (res.statusCode !== 200) {
        return res
      } else {
        if (suggestion.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({ error: 'You only can edit suggestions that you made' })
        }
        suggestion.description = req.body.description

        const savedSuggestion = await suggestion.save()

        await travel.save()
        res.status(201).json({ error: null, data: savedSuggestion })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteSuggestion = async (req, res) => {
  try {
    const travelId = req.params.id
    const suggestionId = req.params.sugId

    const suggestion = await Suggestion.findById(suggestionId)

    if (suggestion.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You only can edit suggestions that you made' })
    }

    const updatedTravel = await PlannedTravel.findByIdAndUpdate(
      travelId,
      { $pull: { suggestions: suggestionId } },
      { new: true }
    )

    const deletedSuggestion = await Suggestion.findByIdAndDelete(suggestionId)
    if (!deletedSuggestion) {
      return res.status(404).json({ error: 'Suggestion not found' })
    }

    res.status(200).json({ error: null, message: 'Suggestion and reference removed successfully', updatedTravel })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const likeSuggestion = async (req, res) => {
  try {
    const userId = req.user._id
    const suggestionId = req.params.sugId
    const suggestion = await Suggestion.findById(suggestionId).populate('approvations')

    const approvationOfUserArray = suggestion.approvations.filter(a => a.user.toString() === userId)

    if (approvationOfUserArray.length === 1) {
      const approvationOfUser = approvationOfUserArray[0]
      if (approvationOfUser.like) {
        approvationOfUser.like = false
      } else {
        approvationOfUser.like = true
        approvationOfUser.dislike = false
      }
      const savedApprovation = await approvationOfUser.save()
      return res.status(200).json({ error: null, data: savedApprovation })
    } else {
      const approvation = new ApprovationSugestion({
        like: true,
        dislike: false,
        user: userId
      })
      const savedApprovation = await approvation.save()
      const updatedSuggestion = await Suggestion.findById(suggestionId)
      updatedSuggestion.approvations.push(savedApprovation._id)
      await updatedSuggestion.save()
      return res.status(201).json({ error: null, data: savedApprovation })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const dislikeSuggestion = async (req, res) => {
  try {
    const userId = req.user._id
    const suggestionId = req.params.sugId
    const suggestion = await Suggestion.findById(suggestionId).populate('approvations')

    const approvationOfUserArray = suggestion.approvations.filter(a => a.user.toString() === userId)

    if (approvationOfUserArray.length === 1) {
      const approvationOfUser = approvationOfUserArray[0]
      if (approvationOfUser.dislike) {
        approvationOfUser.dislike = false
      } else {
        approvationOfUser.dislike = true
        approvationOfUser.like = false
      }
      const savedApprovation = await approvationOfUser.save()
      return res.status(200).json({ error: null, data: savedApprovation })
    } else {
      const approvation = new ApprovationSugestion({
        dislike: true,
        like: false,
        user: userId
      })
      const savedApprovation = await approvation.save()
      const updatedSuggestion = await Suggestion.findById(suggestionId)
      updatedSuggestion.approvations.push(savedApprovation._id)
      await updatedSuggestion.save()
      return res.status(201).json({ error: null, data: savedApprovation })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const changeState = async (req, res) => {
  try {
    const travelId = req.params.id
    const travel = await PlannedTravel.findById(travelId)
    if (travel.state === 'Planning') {
      travel.state = 'Planned'
    } else if (travel.state === 'Planned') {
      travel.state = 'Planning'
    } else {
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    await travel.save()
    res.status(200).json({ error: null, message: `You have changed your travel's state to: ${travel.state}` })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
