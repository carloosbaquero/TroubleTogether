import mongoose from 'mongoose'
import ApprovationSugestion from './approvationSugestion.js'

const Schema = mongoose.Schema

const SuggestionSchema = new Schema({
  description: {
    type: String,
    required: true,
    max: 1500,
    min: 2
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ApprovationSugestion'
    }
  ]
},
{ timestamps: true })

SuggestionSchema.pre('findByIdAndDelete', { document: true, query: false }, async function (next) {
  try {
    if (this.approvations?.length > 0) {
      const approvationsPromises = this.approvations.map(async (approvationId) => {
        return await ApprovationSugestion.findByIdAndDelete(approvationId)
      })
      await Promise.all(approvationsPromises)
    }

    next()
  } catch (error) {
    next(error)
  }
})

export default mongoose.model('Suggestion', SuggestionSchema)
