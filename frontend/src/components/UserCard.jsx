import computeAge from '../utils/computeAge'
import './UserCard.css'

const UserCard = ({ user }) => {
  return (
    <div className='user'>
      <div className='user-profPic'>
        <img src={user?.profPic ? user.profPic : '/default-profile-pic.jpg'} alt='Profile' className='user-profPic' />
      </div>
      <h2>{user.username}</h2>
      <br />
      <hr />
      <h4>{computeAge(user?.birthDate)} years old</h4>
      <h4>{user.city}, {user.country}</h4>

    </div>
  )
}

export default UserCard
