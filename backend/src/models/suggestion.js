import mongoose from 'mongoose'

const Schema = mongoose.Schema

const suggestionSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 6,
    max: 60
  },
  description: {
    type: String,
    max: 550
  },
  approved: {
    type: Boolean,
    default: false
  },
  rejected: {
    type: Boolean,
    default: false
  },
  approvations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ApprovationSugestion'
    }
  ]
},
{ timestamps: true })

export default mongoose.model('Suggestion', suggestionSchema)
