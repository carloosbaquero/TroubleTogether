import Joi from '@hapi/joi'
import countries from '../../utils/countries.js'

export const createTravelValidation = async (req, res) => {
  const destinationSchema = Joi.object({
    city: Joi.string().max(30).required().label('City'),
    country: Joi.string().valid(...countries).required().label('Country'),
    startDest: Joi.date().min('now').required().label('Start Destination'),
    endDest: Joi.date()
      .min(Joi.ref('startDest'))
      .required()
      .label('End Destination')
  })

  const travelSchema = Joi.object({
    // organizerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().label('OrganizerId'),
    name: Joi.string().min(6).max(60).required().label('Name'),
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

  if (!error && !atendeesError) {
    return res.status(200)
  }
}

export const updateTravelValidation = async (req, res) => {
  const travelSchema = Joi.object({
    name: Joi.string().min(6).max(60).label('Name'),
    description: Joi.string().max(1000).label('Description'),
    startDate: Joi.date().min('now').label('Start Date'),
    endDate: Joi.date().min(Joi.ref('startDate')).label('End Date'),
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

  const atendeesError = req.body.minAtendees > req.body.maxAtendees
  if (atendeesError) {
    return res.status(400).json(
      { error: 'Minimum atendees must be lower or equal than maximum atendees' }
    )
  }

  if (!error && !atendeesError) {
    return res.status(200)
  }
}
