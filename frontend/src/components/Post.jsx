import { IoIosAddCircle } from 'react-icons/io'
import './Post.css'
import { useState } from 'react'
import { LiaCommentSolid } from 'react-icons/lia'
import { FcLikePlaceholder, FcLike } from 'react-icons/fc'
import api from '../utils/api'
import Modal from 'react-modal'
import { MdDelete } from 'react-icons/md'

const Post = ({ travelId, postId, user, imageUrl, description, add, setAddMode, handleReload, postUser }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [input, setInput] = useState({
    description
  })

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
          <h3>Delete Daily Itinerary</h3>
          <br />
          <p>Do you want to delete this daily itinerary?</p>
          <br />
          <div className='modal-buttons'>
            <button className='green-button' onClick={() => setShowModalDelete(false)}>Go back</button>
            <button className='red-button' onClick={handleDelete}>Delete</button>
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
              <div className='profile-picture-atendee'>
                <img src={postUser?.profPic ? postUser.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
              </div>
              <p>{postUser?.username}</p>
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
              <LiaCommentSolid onClick={handleAdd} />
              <p>10</p>
              <FcLikePlaceholder onClick={() => setAddMode(false)} />
              <p>10</p>
            </div>}
        </div>
      </div>
    </>
  )
}

export default Post
