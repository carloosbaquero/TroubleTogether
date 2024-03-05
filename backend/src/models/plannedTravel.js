import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PlannedTravelSchema = new Schema({
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    min: 6,
    max: 60
  },
  description: {
    type: String,
    max: 1000
  },
  destination: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Destination'
    }
  ],
  suggestions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Suggestion'
    }
  ],
  itinerary: [
    {
      type: Schema.Types.ObjectId,
      ref: 'DailyItinerary'
    }
  ],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  atendees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  maxAtendees: {
    type: Number,
    default: 5,
    min: 2,
    max: 30
  },
  minAtendees: {
    type: Number,
    default: 3,
    min: 2,
    max: 30
  },
  state: {
    type: String,
    enum: ['Planning', 'Planned', 'In Progress', 'Completed'],
    default: 'Planning'
  }
},
{ timestamps: true }
)

export default mongoose.model('PlannedTravel', PlannedTravelSchema)
