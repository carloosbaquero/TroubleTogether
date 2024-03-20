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
    ref: 'User',
    unique: true
  }
})

export default mongoose.model('Request', RequestSchema)
