import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RequestSchema = new Schema({
  approved: {
    type: Boolean,
    default: false
  },
  rejected: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  travel: {
    type: Schema.Types.ObjectId,
    ref: 'PlannedTravel'
  }
})
RequestSchema.index({ user: 1, travel: 1 }, { unique: true })

export default mongoose.model('Request', RequestSchema)
