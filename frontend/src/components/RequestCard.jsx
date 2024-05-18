import { useState } from 'react'
import api from '../utils/api'
import './RequestCard.css'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const RequestCard = ({ requestId, userId, username, profPic, travelId }) => {
  const [approved, setApproved] = useState(false)
  const [rejected, setRejected] = useState(false)

  const navigate = useNavigate()

  const handleApprove = async () => {
    try {
      const { data } = await api.post(`/requests/travel/${travelId}/approve/${requestId}`)
      if (data.error === null) {
        setApproved(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleReject = async () => {
    try {
      const { data } = await api.post(`/requests/travel/${travelId}/reject/${requestId}`)
      if (data.error === null) {
        setRejected(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='request-card'>
      <div className='atendee'>
        <div onClick={() => navigate(`/globetrotters/proffile/${userId}`)} className='profile-picture-atendee'>
          <img src={profPic || 'default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
        </div>
        <p className='username-atendee' onClick={() => navigate(`/globetrotters/proffile/${userId}`)}>{username}</p>
      </div>
      <div className='request-card-buttons'>
        {!rejected
          ? (
            <button className='red-button' disabled={approved} onClick={handleReject}>Reject</button>
            )
          : (
            <p>Rejected!</p>
            )}
        {!approved
          ? (
            <button className='green-button' disabled={rejected} onClick={handleApprove}>Approve</button>
            )
          : (
            <p>Approved!</p>
            )}
      </div>
    </div>
  )
}

RequestCard.propTypes = {
  requestId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  travelId: PropTypes.string.isRequired
}

export default RequestCard
