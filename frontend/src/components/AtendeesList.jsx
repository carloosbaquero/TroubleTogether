import { AiFillStar } from 'react-icons/ai'
import { FaUsers } from 'react-icons/fa6'
import PropTypes from 'prop-types'
import './AtendeesList.css'

const AtendeesList = ({ organizer, atendees, maxAtendees, minAtendees }) => {
  return (
    <div className='atendees-list'>
      <div className='atendees-title'>
        <h3>Atendees</h3>
        <h3 className='number-atendees'>{atendees.length + 1}/{maxAtendees} <FaUsers /></h3>
      </div>
      <hr />
      <div className='atendees'>
        <div className='atendee'>
          <div className='profile-picture-atendee'>
            <img src={organizer.profPic ? organizer.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
          </div>
          <p>{organizer.username} <AiFillStar /></p>
        </div>
        {atendees.map((value, index) => {
          return (
            <div key={index} className='atendee'>
              <div className='profile-picture-atendee'>
                <img src={value.profPic ? value.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
              </div>
              <p>{value.username}</p>
            </div>
          )
        })}
      </div>
      <hr />
      <h6>Atendees required: {minAtendees}</h6>
    </div>
  )
}

AtendeesList.propTypes = {
  organizer: PropTypes.object.isRequired,
  atendees: PropTypes.array.isRequired,
  maxAtendees: PropTypes.number.isRequired,
  minAtendees: PropTypes.number.isRequired
}

export default AtendeesList
