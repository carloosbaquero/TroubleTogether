import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import './Proffile.css'
import api from '../../utils/api'
import TravelCard from '../../components/TravelCard'
import computeAge from '../../utils/computeAge'
import Loader from '../../components/Loader'

const MyProffileScreen = () => {
  const [user, setUser] = useState({})
  const [atendingTravels, setAtendingTravels] = useState([])
  const [organizedTravels, setOrganizedTravels] = useState([])

  const [loading, setLoading] = useState(true)
  const tabs = [
    {
      title: 'Planning Travels',
      content:
  <div className='travel-cards-container'>
    {organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planning').length > 0 && organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planning').map((travel, index) => {
      return <TravelCard key={index} id={travel._id} name={travel.name} startDate={travel.startDate} endDate={travel.endDate} destinations={travel.destination} atendees={travel.atendees} maxAtendees={travel.maxAtendees} />
    })}
  </div>
    },
    {
      title: 'Planned Travels',
      content:
  <div className='travel-cards-container'>
    {organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planned').length > 0 && organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planned').map((travel, index) => {
      return <TravelCard key={index} id={travel._id} name={travel.name} startDate={travel.startDate} endDate={travel.endDate} destinations={travel.destination} atendees={travel.atendees} maxAtendees={travel.maxAtendees} />
    })}
  </div>
    },
    { title: 'Posts', content: <div>To implement 3</div> },
    { title: 'Bucket List', content: <div>To implement 4</div> }
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/users/my-prof')
        console.log(data)
        setAtendingTravels(data.data.travelsAtending)
        setOrganizedTravels(data.data.travelsOrganizing)
        setUser(data.data.user)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  if (loading) {
    return (<Loader />)
  }

  return (
    <>
      <Header />
      <div className='myproffile'>

        <div className='myproffile-cont'>
          <div className='myprofile-image'>
            <img src='/login.png' alt='Profile' className='profile-picture__image' />
          </div>
          <div className='myproffile-info'>
            <h1>{user?.username}</h1>
            <div className='myproffile-subinfo'>
              <div>
                <h4>{computeAge(user?.birthDate)} years old</h4>
                <h4>{user?.city}, {user.country}</h4>
              </div>

              <div>
                <h6>Description:</h6>
                <p>{user?.description ? user?.description : 'No description'}</p>
              </div>

            </div>

          </div>

        </div>
        <br />
        <br />
        <hr />
        <Tabs tabs={tabs} />
      </div>
    </>
  )
}

export default MyProffileScreen
