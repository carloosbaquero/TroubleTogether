import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  comment: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  }
},
{ timestamps: true })

export default mongoose.model('Comment', CommentSchema)
