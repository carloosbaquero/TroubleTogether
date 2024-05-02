import mongoose from 'mongoose'
import countries from '../utils/countries.js'
const Schema = mongoose.Schema

const DestinationSchema = new Schema({
  city: {
    type: String,
    max: 30,
    required: true
  },
  country: {
    type: String,
    enum: countries,
    required: true
  },
  hotel: {
    type: String,
    max: 50
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
})

export default mongoose.model('Destination', DestinationSchema)
