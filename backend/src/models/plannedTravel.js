import mongoose from 'mongoose'
import Destination from './destination.js'
import Suggestion from './suggestion.js'
import DailyItinerary from './dailyItinerary.js'
import Request from './request.js'
import Post from './post.js'

const Schema = mongoose.Schema

const PlannedTravelSchema = new Schema({
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 60
  },
  description: {
    type: String,
    max: 1000
  },
  destination: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Destination'
    }
  ],
  suggestions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Suggestion'
    }
  ],
  itinerary: [
    {
      type: Schema.Types.ObjectId,
      ref: 'DailyItinerary'
    }
  ],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  atendees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  maxAtendees: {
    type: Number,
    default: 5,
    min: 2,
    max: 30
  },
  minAtendees: {
    type: Number,
    default: 3,
    min: 2,
    max: 30
  },
  state: {
    type: String,
    enum: ['Planning', 'Planned'],
    default: 'Planning'
  },
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Request'
    }
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
},
{ timestamps: true }
)

PlannedTravelSchema.pre('save', async function (next) {
  try {
    const destinationPromises = this.destination.map(async (destinationId) => {
      return await Destination.findById(destinationId)
    })
    this.destination = await Promise.all(destinationPromises)
    this.destination.sort((a, b) => a.startDate - b.startDate)

    const itineraryPromises = this.itinerary.map(async (itineraryId) => {
      return await DailyItinerary.findById(itineraryId)
    })
    this.itinerary = await Promise.all(itineraryPromises)
    this.itinerary.sort((a, b) => a.date - b.date)

    const suggestionsPromises = this.suggestions.map(async (suggestionId) => {
      return await Suggestion.findById(suggestionId)
    })
    this.suggestions = await Promise.all(suggestionsPromises)
    this.suggestions.sort((a, b) => b.updatedAt - a.updatedAt)

    const postsPromises = this.posts.map(async (postId) => {
      return await Post.findById(postId)
    })
    this.posts = await Promise.all(postsPromises)
    this.posts.sort((a, b) => b.createdAt - a.createdAt)

    next()
  } catch (error) {
    next(error)
  }
})

PlannedTravelSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    if (this.destination?.length > 0) {
      const destinationPromises = this.destination.map(async (destinationId) => {
        return await Destination.findByIdAndDelete(destinationId)
      })
      await Promise.all(destinationPromises)
    }

    if (this.suggestions?.length > 0) {
      const suggestionPromises = this.suggestions.map(async (suggestionId) => {
        return await Suggestion.findByIdAndDelete(suggestionId)
      })
      await Promise.all(suggestionPromises)
    }

    if (this.itinerary?.length > 0) {
      const itineraryPromises = this.itinerary.map(async (itineraryId) => {
        return await DailyItinerary.findByIdAndDelete(itineraryId)
      })
      await Promise.all(itineraryPromises)
    }

    if (this.requests?.length > 0) {
      const requestsPromises = this.requests.map(async (requestId) => {
        return await Request.findByIdAndDelete(requestId)
      })
      await Promise.all(requestsPromises)
    }

    next()
  } catch (error) {
    next(error)
  }
})

export default mongoose.model('PlannedTravel', PlannedTravelSchema)
