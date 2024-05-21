import { MdDelete } from 'react-icons/md'
import './Comment.css'
import { useState } from 'react'
import Modal from 'react-modal'
import api from '../utils/api'
import { useLocation, useNavigate } from 'react-router-dom'

const Comment = ({ user, comment, comments, setComments, travelId, postId }) => {
  const [showModalDelete, setShowModalDelete] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const handleDelete = async () => {
    try {
      const { data } = await api.delete(`/travels/dashboard/${travelId}/post/${postId}/comment/${comment._id}`)
      if (data.error === null) {
        setComments(data.data.comments)
        setShowModalDelete(false)
      }
    } catch (err) {

    }
  }

  return (
    <>
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
          <h3>Delete Comment</h3>
          <br />
          <p>Do you want to delete this comment?</p>
          <br />
          <div className='modal-buttons'>
            <button className='green-button' onClick={() => setShowModalDelete(false)}>Go back</button>
            <button className='red-button' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </Modal>

      <div className='comment'>
        <div className='post-card-top'>
          <div className='atendee'>
            <div className='profile-picture-atendee' onClick={() => { if (location.pathname !== `/globetrotters/proffile/${comment.user._id}`)navigate(`/globetrotters/proffile/${comment.user._id}`) }}>
              <img src={comment.user?.profPic ? comment.user.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
            </div>
            <p className='username-atendee' onClick={() => { if (location.pathname !== `/globetrotters/proffile/${comment.user._id}`) navigate(`/globetrotters/proffile/${comment.user._id}`) }}>{comment.user?.username}</p>
          </div>
          {user?.userId?.toString() === comment.user?._id?.toString() &&
            <div className='post-top-icons'>
              <MdDelete className='edit-icon' onClick={() => setShowModalDelete(true)} style={{ alignContent: 'center' }} />
            </div>}
        </div>
        <div className='edit-dest-card'>
          <textarea name='itinerary-info' value={comment?.comment} disabled />
        </div>
      </div>
    </>
  )
}

export default Comment
