import mongoose, { Schema } from 'mongoose'
import countries from '../utils/countries.js'
import { nativeNames } from '../utils/languages.js'

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
  nationality: {
    type: String,
    enum: [...countries],
    required: false
  },
  residence: {
    type: String,
    required: false,
    max: 30
  },
  languages: [
    {
      type: String,
      enum: [...nativeNames]
    }
  ],
  visitedCountries: [
    {
      type: String,
      enum: [...countries]
    }
  ],
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin'],
    default: ['user']
  }
},
{ timestamps: true }
)

export default mongoose.model('User', UserSchema)
