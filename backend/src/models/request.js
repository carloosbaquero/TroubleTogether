import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RequestSchema = new Schema({
  approved: {
    type: Boolean,
    required: true
  },
  rejected: {
    type: Boolean,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('Request', RequestSchema)
