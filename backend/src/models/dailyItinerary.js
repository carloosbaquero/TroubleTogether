import mongoose from 'mongoose'

const Schema = mongoose.Schema

const DailyItinerarySchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  itinerary: {
    type: String,
    max: 1500,
    min: 2,
    required: true
  },
  approvations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ApprovationItinerary'
    }
  ]
})

export default mongoose.model('DailyItinerary', DailyItinerarySchema)
