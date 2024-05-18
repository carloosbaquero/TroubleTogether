import Post from '../models/post.js'
import PlannedTravel from '../models/plannedTravel.js'
import config from '../../config.js'
import Like from '../models/like.js'
import Comment from '../models/comment.js'

export const addPost = async (req, res) => {
  try {
    const travelId = req.params.id
    const travel = await PlannedTravel.findById(travelId)

    const { filename } = req.file

    const { HOST_DIR } = config
    const image = `${HOST_DIR}/public/posts/${filename}`

    const newPost = new Post({
      image,
      user: req.user._id,
      travel: travelId,
      description: req.body.description
    })

    const savedPost = await newPost.save()

    travel.posts.push(savedPost._id)
    await travel.save()
    res.status(201).json({ error: null, data: savedPost })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deletePost = async (req, res) => {
  try {
    const travelId = req.params.id

    const postId = req.params.postId
    const post = await Post.findById(postId)

    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(403).json({ error: 'This Post does not belong to you' })
    }

    const updatedTravel = await PlannedTravel.findByIdAndUpdate(
      travelId,
      { $pull: { posts: postId } },
      { new: true }
    )

    const deletedPost = await post.deleteOne()
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.status(201).json({ error: null, data: updatedTravel })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const likePost = async (req, res) => {
  try {
    const userId = req.user._id

    const postId = req.params.postId
    const post = await Post.findById(postId).populate('likes')

    const likeOfUser = post.likes.filter(a => a?.user?.toString() === userId.toString() && a?.post?.toString() === postId.toString())

    if (likeOfUser.length === 1) {
      post.likes.pull(likeOfUser[0])
      await Like.findByIdAndDelete(likeOfUser[0])
    } else {
      const newLike = new Like({
        user: userId,
        post: postId
      })
      const savedLike = await newLike.save()
      post.likes.push(savedLike._id)
    }
    await post.save()
    const postwithLikes = await Post.findById(postId).populate('likes')

    res.status(201).json({ error: null, data: postwithLikes })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const addComment = async (req, res) => {
  try {
    const userId = req.user._id

    const postId = req.params.postId
    const post = await Post.findById(postId)

    const newComment = new Comment({
      user: userId,
      post: postId,
      comment: req.body.comment
    })

    const savedComment = await newComment.save()

    post.comments.push(savedComment._id)

    await post.save()
    const postwithComments = await Post.findById(postId)
      .populate({
        path: 'comments',
        populate: { path: 'user' }
      })

    res.status(201).json({ error: null, data: postwithComments })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId
    const post = await Post.findById(postId)

    const commentId = req.params.comId

    await Comment.findByIdAndDelete(commentId)

    post.comments.pull(commentId)

    await post.save()
    const postwithComments = await Post.findById(postId)
      .populate({
        path: 'comments',
        populate: { path: 'user' }
      })

    res.status(201).json({ error: null, data: postwithComments })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate('user')
      .populate('likes')
      .populate({
        path: 'comments',
        populate: { path: 'user' }
      })

    res.status(200).json({ error: null, data: posts })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
