import { IoIosAddCircle } from 'react-icons/io'
import './Post.css'
import { useState } from 'react'
import { LiaCommentSolid } from 'react-icons/lia'
import { FcLikePlaceholder, FcLike } from 'react-icons/fc'
import api from '../utils/api'
import Modal from 'react-modal'
import { MdDelete } from 'react-icons/md'
import Comment from './Comment'
import { useNavigate } from 'react-router-dom'

const Post = ({ travelId, postId, user, imageUrl, description, add, setAddMode, handleReload, postUser, postLikes, postComments }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalComments, setShowModalComments] = useState(false)
  const [likes, setLikes] = useState(postLikes)
  const [comments, setComments] = useState(postComments)
  const [showNotLogged, setShowNotLogged] = useState(false)
  const [input, setInput] = useState({
    description
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setInput(prevInput => ({
      ...prevInput,
      [name]: value
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIconClick = () => {
    document.getElementById('post-pic').click()
  }

  const handleDelete = async () => {
    try {
      const { data } = await api.delete(`/travels/dashboard/${travelId}/post/${postId}`)
      if (data.error === null) {
        setShowModalDelete(false)
        handleReload()
      }
    } catch (err) {

    }
  }

  const handleAdd = async () => {
    try {
      if (!selectedFile || !input.description) {
        setError('You can not add a Post with no image nor description to the travel')
      } else {
        const formData = new FormData()
        formData.append('image', selectedFile)
        formData.append('description', input.description)
        const { data } = await api.post(`/travels/dashboard/${travelId}/post`, formData)

        if (data.error === null) {
          setInput({})
          setAddMode(false)
          handleReload()
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleLike = async () => {
    try {
      if (!user.userId) {
        setShowNotLogged(true)
      } else {
        const { data } = await api.post(`/travels/dashboard/${travelId}/post/${postId}`)
        if (data.error === null) {
          setLikes(data.data.likes)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddComment = async () => {
    try {
      if (!user.userId && input.comment) {
        setShowNotLogged(true)
      } else if (input.comment !== '' && input.comment) {
        const body = { comment: input.comment }
        const { data } = await api.post(`/travels/dashboard/${travelId}/post/${postId}/comment`, body)
        if (data.error === null) {
          setComments(data.data.comments)
          setInput({ description: input.description, comment: '' })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Modal
        isOpen={showNotLogged} style={{
          overlay: {
            zIndex: 5
          },
          content: {
            width: '320px',
            height: '200px',
            margin: 'auto'
          }
        }}
      >
        <div>
          <h3>Forbidden Action</h3>
          <br />
          <p>If you want to like or comment a post, you must Log In</p>
          <br />
          <div className='modal-buttons'>
            <button className='red-button' onClick={() => setShowNotLogged(false)}>Don`t Log In</button>
            <button className='green-button' onClick={() => navigate('/globetrotters/sign')}>Go Log In</button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showModalDelete} style={{
          overlay: {
            zIndex: 3
          },
          content: {
            width: '320px',
            height: '200px',
            margin: 'auto'
          }
        }}
      >
        <div>
          <h3>Delete Post</h3>
          <br />
          <p>Do you want to delete this post?</p>
          <br />
          <div className='modal-buttons'>
            <button className='green-button' onClick={() => setShowModalDelete(false)}>Go back</button>
            <button className='red-button' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showModalComments} style={{
          overlay: {
            zIndex: 3
          },
          content: {
            maxWidth: '420px',
            minHeight: '200px',
            margin: 'auto'
          }
        }}
      >
        <div>
          <h3>Comments</h3>
          <br />
          <div className='edit-dest-card'><textarea name='comment' type='text' placeholder='Write a comment...' value={input.comment} onChange={handleChange} /></div>
          <br />
          <div className='modal-buttons'>
            <button className='green-button' style={{ cursor: !input.comment ? 'not-allowed' : 'pointer' }} onClick={handleAddComment}>Send comment </button>
            <button className='red-button' onClick={() => setShowModalComments(false)}>Go back</button>
          </div>
          <br />
          <hr />
          <div>
            {comments?.map((value, index) => {
              return (
                <Comment key={index} user={user} comment={value} comments={comments} setComments={setComments} travelId={travelId} postId={postId} />
              )
            })}
          </div>
        </div>
      </Modal>

      <div className='post' style={add ? { maxHeight: '600px' } : { maxHeight: '500px' }}>
        {add &&
          <div className='dest-card-icons'>
            <button className='green-button' onClick={handleAdd}>Add Post</button>
            <button className='red-button' onClick={() => setAddMode(false)}>Cancel</button>
          </div>}
        {error &&
          <>
            <p className='error-message'>{error}</p>
          </>}

        {!add &&
          <div className='post-card-top'>
            <div className='atendee'>
              <div className='profile-picture-atendee' onClick={() => navigate(`/globetrotters/proffile/${postUser?._id}`)}>
                <img src={postUser?.profPic ? postUser.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
              </div>
              <p className='username-atendee' onClick={() => navigate(`/globetrotters/proffile/${postUser?._id}`)}>{postUser?.username}</p>
            </div>
            {user?.userId?.toString() === postUser?._id?.toString() &&
              <div className='post-top-icons'>
                <MdDelete className='edit-icon' onClick={() => setShowModalDelete(true)} style={{ alignContent: 'center' }} />
              </div>}
          </div>}
        {add &&
          <div className='dest-card-top'>
            <div className='atendee'>
              <div className='profile-picture-atendee'>
                <img src={user?.profPic ? user.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
              </div>
              <p>{user?.username}</p>
            </div>
          </div>}

        {!add
          ? (
            <div className='image-cont'>
              <img alt={`Post-${postId}`} src={imageUrl} />
            </div>
            )
          : (
            <div className='image-cont'>
              {previewUrl !== ''
                ? (
                  <>
                    <input
                      type='file'
                      accept='image/*'
                      id='post-pic'
                      onChange={handleFileChange}
                    />
                    <img className='add-img' alt={`Post-${postId}`} src={previewUrl} onClick={handleIconClick} />
                  </>

                  )
                : (
                  <>
                    <input
                      type='file'
                      accept='image/*'
                      id='post-pic'
                      onChange={handleFileChange}
                    />
                    <IoIosAddCircle className='add-post' onClick={handleIconClick} />
                  </>
                  )}

            </div>
            )}
        <div className='post-bottom'>
          {add &&
            <>
              <label>Add a description:</label>
              <div className='edit-dest-card'><textarea name='description' type='text' value={input.description} onChange={handleChange} /></div>
            </>}
          {!add && <div className='edit-dest-card'><textarea name='itinerary-info' value={description} disabled /></div>}
          {!add &&
            <div className='dest-card-icons'>
              <div className='dest-card-icons'>
                <LiaCommentSolid className='edit-icon' onClick={() => setShowModalComments(true)} />
                <p className='number-like'>{comments.length}</p>
              </div>
              <div className='dest-card-icons'>
                {likes.filter(a => (a.user.toString() === user?.userId.toString())).length === 0 && <FcLikePlaceholder className='edit-icon' onClick={handleLike} />}
                {likes.filter(a => (a.user.toString() === user?.userId.toString())).length === 1 && <FcLike className='edit-icon' onClick={handleLike} />}
                <p className='number-like'>{likes.length}</p>
              </div>
            </div>}
        </div>
      </div>
    </>
  )
}

export default Post
