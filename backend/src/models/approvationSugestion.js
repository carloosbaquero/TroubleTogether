import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ApprovationSugestionSchema = new Schema({
  like: {
    type: Boolean,
    required: true
  },
  dislike: {
    type: Boolean,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('ApprovationSugestion', ApprovationSugestionSchema)
