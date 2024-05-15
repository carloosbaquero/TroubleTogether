import mongoose from 'mongoose'
const Schema = mongoose.Schema

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  }
})

LikeSchema.index({ user: 1, post: 1 }, { unique: true })

export default mongoose.model('Like', LikeSchema)
