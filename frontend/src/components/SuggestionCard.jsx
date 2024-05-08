import PropTypes from 'prop-types'
import './SuggestionCard.css'
import { GrEdit } from 'react-icons/gr'
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi'

import { MdDelete } from 'react-icons/md'
import { useEffect, useState } from 'react'
import api from '../utils/api'
import Loader from './Loader'
import Modal from 'react-modal'

const SuggestionCard = ({ handleReload, travelId, suggestionId, suggestionUser, descriptionProp, dash, participant, approvationsProp, planned }) => {
  const [editMode, setEditMode] = useState(false)
  const [editError, setEditError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [description, setDescription] = useState(descriptionProp)
  const [approvations, setApprovations] = useState(approvationsProp)
  const [likes, setLikes] = useState(approvationsProp.filter(a => a.like).length)
  const [dislikes, setDislikes] = useState(approvationsProp.filter(a => a.dislike).length)
  const [input, setInput] = useState({
    description: descriptionProp
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setInput(prevInput => ({
      ...prevInput,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setEditMode(false)
    setInput({
      description
    })
  }

  const handleApply = async () => {
    try {
      const { data } = await api.put(`/travels/dashboard/${travelId}/suggestion/${suggestionId}`, input)
      if (data.error === null) {
        setDescription(data.data.description)
        setEditMode(false)
        handleReload()
      }
    } catch (err) {
      console.log(err)
      setEditError(err.response.data.error)
    }
  }

  const handleDelete = async () => {
    try {
      const { data } = await api.delete(`/travels/dashboard/${travelId}/suggestion/${suggestionId}`)
      if (data.error === null) {
        setShowModal(false)
        handleReload()
      }
    } catch (err) {

    }
  }

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/travels/dashboard/${travelId}/suggestion/${suggestionId}/like`)
      if (data.error === null) {
        const newApprovations = approvations.filter(a => (a.user !== participant?.userId))
        newApprovations.push(data.data)
        setApprovations(newApprovations)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDislike = async () => {
    try {
      const { data } = await api.post(`/travels/dashboard/${travelId}/suggestion/${suggestionId}/dislike`)
      if (data.error === null) {
        const newApprovations = approvations.filter(a => (a.user !== participant?.userId))
        newApprovations.push(data.data)
        setApprovations(newApprovations)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (travelId && description && input) {
      setLoading(false)
    }
    setLikes(approvations.filter(a => a.like).length)
    setDislikes(approvations.filter(a => a.dislike).length)
  }, [travelId, description, input, approvations])

  if (loading) {
    return (<Loader />)
  }

  return (
    <>
      <Modal
        isOpen={showModal} style={{
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
            <button className='green-button' onClick={() => setShowModal(false)}>Go back</button>
            <button className='red-button' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </Modal>

      <div className='suggestion-card'>
        {editError && editMode &&
          <>
            <p className='error-message'>{editError}</p>
          </>}

        <div className='dest-card-top'>
          <div className='atendee'>
            <div className='profile-picture-atendee'>
              <img src='/login.png' alt='Profile' className='profile-picture__image' />
            </div>
            <p>{suggestionUser?.username}</p>
          </div>
          {dash && participant?.userId === suggestionUser?._id && !editMode && !planned &&
            <div className='dest-card-icons'>
              <GrEdit onClick={() => setEditMode(true)} className='edit-icon' />
              <MdDelete onClick={() => setShowModal(true)} className='edit-icon' />
            </div>}
          {dash && participant?.userId === suggestionUser?._id && editMode &&
            <div className='dest-card-icons'>
              <button className='green-button' onClick={handleApply}>Apply</button>
              <button className='red-button' onClick={handleCancel}>Cancel</button>
            </div>}

        </div>
        {editMode
          ? (
            <>
              <div className='edit-dest-card'><textarea name='description' value={input.description} onChange={handleChange} /></div>
            </>)
          : (
            <>
              <div>
                <textarea name='itinerary-info' value={description} disabled />
                {!planned &&
                  <div className='dest-card-icons'>
                    <div className='dest-card-icons'>
                      {approvations.some(a => (a.user === participant?.userId) && a.dislike)
                        ? (
                          <BiSolidDislike className='edit-icon' onClick={handleDislike} />
                          )
                        : (
                          <BiDislike className='edit-icon' onClick={handleDislike} />
                          )}

                      <p className='number-like'>{dislikes}</p>
                    </div>
                    <div className='dest-card-icons'>
                      {approvations.some(a => (a.user === participant?.userId) && a.like)
                        ? (
                          <BiSolidLike className='edit-icon' onClick={handleLike} />
                          )
                        : (
                          <BiLike className='edit-icon' onClick={handleLike} />
                          )}

                      <p className='number-like'>{likes}</p>
                    </div>
                  </div>}
              </div>

            </>)}

      </div>
    </>
  )
}

SuggestionCard.propTypes = {
  handleReload: PropTypes.func,
  travelId: PropTypes.string.isRequired,
  suggestionId: PropTypes.string,
  suggestionUser: PropTypes.object.isRequired,
  descriptionProp: PropTypes.string.isRequired,
  dash: PropTypes.bool,
  participant: PropTypes.object.isRequired,
  approvationsProp: PropTypes.array.isRequired,
  planned: PropTypes.bool.isRequired
}

export default SuggestionCard
