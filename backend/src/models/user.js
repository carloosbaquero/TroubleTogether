import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      min: 6,
      max: 30
    },
    name: {
      type: String,
      required: false,
      min: 3,
      max: 150
    },
    lastName: {
      type: String,
      required: false,
      min: 3,
      max: 150
    },
    email: {
      type: String,
      unique: true,
      required: true,
      min: 6,
      max: 254
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
      required: false
    },
    residence: {
      type: String,
      required: false
    },
    languages: {
      type: Array,
      required: false
    },
    visitedCountries: {
      type: Array,
      required: false
    },
    roles: {
      type: [String],
      enum: ['user', 'admin', 'super_admin'],
      default: ['user']
    }
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
