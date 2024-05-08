import mongoose, { Schema } from 'mongoose'
import countries from '../utils/countries.js'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    min: 6,
    max: 20
  },
  name: {
    type: String,
    required: false,
    min: 2,
    max: 50
  },
  lastName: {
    type: String,
    required: false,
    min: 2,
    max: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    min: 6,
    max: 100
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  description: {
    type: String,
    required: false,
    max: 550
  },
  birthDate: {
    type: Date,
    required: false
  },
  country: {
    type: String,
    enum: countries,
    required: false
  },
  city: {
    type: String,
    required: false,
    max: 30
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin'],
    default: ['user']
  },
  plannedTravels: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PlannedTravel'
    }
  ]
},
{ timestamps: true }
)

export default mongoose.model('User', UserSchema)
