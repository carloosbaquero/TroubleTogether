import mongoose from 'mongoose'
import Like from './like.js'
import Comment from './comment.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const Schema = mongoose.Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  travel: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'PlannedTravel'
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

PostSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    if (this.likes?.length > 0) {
      const likesPromises = this.likes.map(async (likeId) => {
        return await Like.findByIdAndDelete(likeId)
      })
      await Promise.all(likesPromises)
    }

    if (this.comments?.length > 0) {
      const commentsPromises = this.comments.map(async (commentId) => {
        return await Comment.findByIdAndDelete(commentId)
      })
      await Promise.all(commentsPromises)
    }

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const image = this.image.split('/').at(-1)
    const oldFilePath = path.join(__dirname, '..', 'public', 'posts', image)
    console.log(oldFilePath)
    fs.unlink(oldFilePath, (err) => {
      if (err) {
        console.error('Error while deleting old image:', err)
      } else {
        console.log('Old image successfully deleted')
      }
    })
    next()
  } catch (error) {
    next(error)
  }
})

export default mongoose.model('Post', PostSchema)
