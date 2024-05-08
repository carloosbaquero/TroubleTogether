import Joi from '@hapi/joi'
import countries from '../../utils/countries.js'
import Destination from '../../models/destination.js'
import DailyItinerary from '../../models/dailyItinerary.js'

export const createTravelValidation = async (req, res) => {
  const destinationSchema = Joi.object({
    city: Joi.string().max(30).required().label('City'),
    country: Joi.string().valid(...countries).required().label('Country'),
    startDest: Joi.date().min('now').required().label('Start Destination'),
    endDest: Joi.date().min(Joi.ref('startDest')).required().label('End Destination'),
    hotel: Joi.string().max(50).label('Hotel')
  })

  const travelSchema = Joi.object({
    // organizerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().label('OrganizerId'),
    name: Joi.string().min(3).max(60).required().label('Name'),
    description: Joi.string().max(1000).required().label('Description'),
    destinations: Joi.array().items(destinationSchema).label('Destination'),
    startDate: Joi.date().min('now').required().label('Start Date'),
    endDate: Joi.date().min(Joi.ref('startDate')).required().label('End Date'),
    maxAtendees: Joi.number().min(2).max(30).required().label('Maximun Atendees'),
    minAtendees: Joi.number().min(2).max(30).required().label('Minimum Atendees')
  })

  const { error } = travelSchema.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  const atendeesError = req.body.minAtendees > req.body.maxAtendees
  if (atendeesError) {
    return res.status(400).json(
      { error: 'Minimum atendees must be lower or equal than maximum atendees' }
    )
  }

  if (req.body.destinations) {
    const datesError = req.body.destinations.some(x => (x.startDest < req.body.startDate) || (x.endDest > req.body.endDate) || (x.startDest >= x.endDest))
    if (datesError) {
      return res.status(400).json(
        { error: 'Dates on a destination must be inside the dates of the travel. Also, the start date of a destinations must be lower than its end date.' }
      )
    }
  }

  const destinations = req.body.destinations || []
  const datesOverlapError = destinations.some((destination, index) => {
    const restOfDestinations = destinations.slice(index + 1)
    const startDate = new Date(destination.startDest)
    const endDate = new Date(destination.endDest)
    return restOfDestinations.some(otherDestination => {
      const otherStartDate = new Date(otherDestination.startDest)
      const otherEndDate = new Date(otherDestination.endDest)

      const startDateOverlap = (startDate > otherStartDate && startDate < otherEndDate)
      const endDateOverlap = (endDate > otherStartDate && endDate < otherEndDate)
      const datesInside = (startDate < otherStartDate && endDate > otherEndDate)
      const sameEndDates = (endDate.toISOString() === otherEndDate.toISOString())
      const sameStartDates = (startDate.toISOString() === otherStartDate.toISOString())
      return startDateOverlap || endDateOverlap || datesInside || sameEndDates || sameStartDates
    })
  })

  if (datesOverlapError) {
    return res.status(400).json({ error: 'Destination dates overlap with other destinations' })
  }

  if (!error && !atendeesError && !datesOverlapError) {
    return res.status(200)
  }
}

export const updateTravelValidation = async (req, res, travel) => {
  const travelSchema = Joi.object({
    name: Joi.string().min(3).max(60).label('Name'),
    description: Joi.string().max(1000).label('Description'),
    startDate: Joi.date().min('now').label('Start Date'),
    endDate: Joi.date().min('now').label('End Date'),
    maxAtendees: Joi.number().min(2).max(30).label('Maximun Atendees'),
    minAtendees: Joi.number().min(2).max(30).label('Minimum Atendees'),
    state: Joi.string().valid('Planning', 'Planned', 'In Progress', 'Completed').label('State')
  })

  const { error } = travelSchema.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  const minAtendees = req.body.minAtendees ? req.body.minAtendees : travel.minAtendees
  const maxAtendees = req.body.maxAtendees ? req.body.maxAtendees : travel.maxAtendees

  const maxAtendeesError = maxAtendees < travel.atendees.length
  if (maxAtendeesError) {
    return res.status(400).json({ error: 'Max atendees must be bigger or equal than the actual number of atendees' })
  }

  const atendeesError = minAtendees > maxAtendees
  if (atendeesError) {
    return res.status(400).json(
      { error: 'Minimum atendees must be lower or equal than maximum atendees' }
    )
  }

  const startDate = req.body.startDate ? new Date(req.body.startDate) : travel.startDate
  const endDate = req.body.endDate ? new Date(req.body.endDate) : travel.endDate

  const datesDestError = travel.destination.some(dest =>
    dest.startDate < startDate || dest.endDate > endDate
  )
  if (datesDestError) {
    return res.status(400).json({ error: 'These dates make some destinations outside the range' })
  }
  if (!error && !atendeesError && !datesDestError && !maxAtendeesError) {
    return res.status(200)
  }
}

export const updateDestinationValidation = async (req, res, travel) => {
  const destinationSchema = Joi.object({
    city: Joi.string().max(30).label('City'),
    country: Joi.string().valid(...countries).label('Country'),
    startDate: Joi.date().min('now').label('Start Destination'),
    endDate: Joi.date().min('now').label('End Destination'),
    hotel: Joi.string().max(50).label('Hotel')
  })

  const { error } = destinationSchema.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  const dest = await Destination.findById(req.params.destId)

  const startDate = req.body.startDate ? new Date(req.body.startDate) : dest.startDate
  const endDate = req.body.endDate ? new Date(req.body.endDate) : dest.endDate

  const startEndError = startDate >= endDate

  if (startEndError) {
    return res.status(400).json(
      { error: 'Start date of a destinations must be lower than its end date' }
    )
  }

  const datesError = travel.startDate > startDate || travel.endDate < endDate

  if (datesError) {
    return res.status(400).json(
      { error: 'Dates on a destination must be inside the dates of the travel' }
    )
  }
  const datesOverlapError = travel.destination
    .filter(destination => destination._id.toString() !== req.params.destId)
    .some(destination => {
      const startDateOverlap = (startDate > destination.startDate && startDate < destination.endDate)
      const endDateOverlap = (endDate > destination.startDate && endDate < destination.endDate)
      const datesInside = (startDate < destination.startDate && endDate > destination.endDate)
      const sameEndDates = (endDate.toISOString() === destination.endDate.toISOString())
      const sameStartDates = (startDate.toISOString() === destination.startDate.toISOString())

      return startDateOverlap || endDateOverlap || datesInside || sameEndDates || sameStartDates
    })

  if (datesOverlapError) {
    return res.status(400).json({ error: 'Destination dates overlap with existing destinations' })
  }

  if (!error && !datesError && !datesOverlapError) {
    return res.status(200)
  }
}

export const createDestinationValidation = async (req, res, travel) => {
  const destinationSchema = Joi.object({
    city: Joi.string().max(30).required().label('City'),
    country: Joi.string().valid(...countries).required().label('Country'),
    startDate: Joi.date().min('now').required().label('Start Destination'),
    endDate: Joi.date().min(Joi.ref('startDate')).required().label('End Destination'),
    hotel: Joi.string().max(50).label('Hotel')
  })

  const { error } = destinationSchema.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate)

  const startEndError = startDate >= endDate

  if (startEndError) {
    return res.status(400).json(
      { error: 'Start date of a destinations must be lower than its end date' }
    )
  }

  const datesError = travel.startDate > startDate || travel.endDate < endDate

  if (datesError) {
    return res.status(400).json(
      { error: 'Dates on a destination must be inside the dates of the travel' }
    )
  }

  const datesOverlapError = travel.destination.some(destination => {
    const startDateOverlap = (startDate > destination.startDate && startDate < destination.endDate)
    const endDateOverlap = (endDate > destination.startDate && endDate < destination.endDate)
    const datesInside = (startDate < destination.startDate && endDate > destination.endDate)
    const sameEndDates = (endDate.toISOString() === destination.endDate.toISOString())
    const sameStartDates = (startDate.toISOString() === destination.startDate.toISOString())

    return startDateOverlap || endDateOverlap || datesInside || sameEndDates || sameStartDates
  })

  if (datesOverlapError) {
    return res.status(400).json({ error: 'Destination dates overlap with existing destinations' })
  }

  if (!error && !datesError && !datesOverlapError) {
    return res.status(200)
  }
}

export const addDailyItineraryValidation = async (req, res, travel) => {
  const itinerarySchema = Joi.object({
    itinerary: Joi.string().max(1500).min(2).required().label('Itinerary'),
    date: Joi.date().required().label('Date')
  })

  const { error } = itinerarySchema.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }
  const date = new Date(req.body.date)
  const endDate = travel.endDate
  const startDate = travel.startDate

  let errorSameDate = false

  for (const itId of travel.itinerary) {
    const it = await DailyItinerary.findById(itId)
    const itDate = new Date(it.date)

    if (itDate.toISOString() === date.toISOString()) {
      errorSameDate = true
      break
    }
  }

  if (errorSameDate) {
    return res.status(400).json({ error: 'It can only exist one daily itinerary per day' })
  }

  const errorDate = endDate < date || startDate > date
  if (errorDate) {
    return res.status(400).json({ error: 'Date of a daily itinerary must be inside travel`s dates' })
  }

  if (!error && !errorDate && !errorSameDate) {
    return res.status(200)
  }
}

export const updateDailyItineraryValidation = async (req, res, travel, itineraryId) => {
  const itinerarySchema = Joi.object({
    itinerary: Joi.string().max(1500).min(2).required().label('Itinerary'),
    date: Joi.date().required().label('Date')
  })

  const { error } = itinerarySchema.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }
  const date = new Date(req.body.date)
  const endDate = travel.endDate
  const startDate = travel.startDate

  let errorSameDate = false

  for (const itId of travel.itinerary) {
    if (itineraryId.toString() === itId.toString()) {
      continue
    }
    const it = await DailyItinerary.findById(itId)
    const itDate = new Date(it.date)

    if (itDate.toISOString() === date.toISOString()) {
      errorSameDate = true
      break
    }
  }

  if (errorSameDate) {
    return res.status(400).json({ error: 'It can only exist one daily itinerary per day' })
  }

  const errorDate = endDate < date || startDate > date
  if (errorDate) {
    return res.status(400).json({ error: 'Date of a daily itinerary must be inside travel`s dates' })
  }

  if (!error && !errorDate && !errorSameDate) {
    return res.status(200)
  }
}

export const addSuggestionValidation = async (req, res) => {
  const suggestionSchema = Joi.object({
    description: Joi.string().max(1500).min(2).required().label('Suggestion')
  })

  const { error } = suggestionSchema.validate(req.body)
  if (error) {
    return res.status(400).json(
      { error: error.details[0].message }
    )
  }

  if (!error) {
    return res.status(200)
  }
}
