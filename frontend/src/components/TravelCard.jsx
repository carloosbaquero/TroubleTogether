import './TravelCard.css'
import { FaUsers } from 'react-icons/fa6'
import PropTypes from 'prop-types'
import parseDate from '../utils/parseDate'
import { useNavigate } from 'react-router-dom'

const TravelCard = ({ id, name, startDate, endDate, destinations, atendees, maxAtendees }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/globetrotters/travels/${id}/info`)
  }
  return (
    <div className='travel-card' onClick={handleClick}>
      <div className='profile-picture'>
        <img src='/login.png' alt='Profile' className='profile-picture__image' />
      </div>

      <h4>{name}</h4>
      <hr />
      {destinations && destinations.map((dest, index) => {
        return (
          <h5 key={index}>{dest.city}, {dest.country}</h5>
        )
      })}

      <hr />
      <h6>Start: {parseDate(startDate)}</h6>
      <h6>End: {parseDate(endDate)}</h6>
      <h6 className='travel-card-atendees'>{atendees.length + 1}/{maxAtendees} <FaUsers /></h6>

    </div>
  )
}

TravelCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  destinations: PropTypes.array.isRequired,
  atendees: PropTypes.array.isRequired,
  maxAtendees: PropTypes.number.isRequired
}

export default TravelCard
