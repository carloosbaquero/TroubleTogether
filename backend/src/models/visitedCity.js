import mongoose from 'mongoose'
import countries from '../utils/countries'

const Schema = mongoose.Schema

const VisitedCitySchema = new Schema({
  country: {
    type: String,
    enum: countries,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  inBucket: {
    type: Boolean,
    required: true
  }
})

export default mongoose.model('VisitedCity', VisitedCitySchema)
