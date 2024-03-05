import mongoose from 'mongoose'

const Schema = mongoose.Schema

const DailyItinerarySchema = new Schema({
  itinerary: {
    type: String,
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
