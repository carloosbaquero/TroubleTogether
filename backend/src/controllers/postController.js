import Post from '../models/post.js'
import PlannedTravel from '../models/plannedTravel.js'
import config from '../../config.js'

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
