import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import './Proffile.css'
import api from '../../utils/api'
import TravelCard from '../../components/TravelCard'
import computeAge from '../../utils/computeAge'
import Loader from '../../components/Loader'
import Post from '../../components/Post'
import { useNavigate, useParams } from 'react-router-dom'

const ProffileScreen = () => {
  const [user, setUser] = useState({})
  const [userProf, setUserProf] = useState({})
  const [atendingTravels, setAtendingTravels] = useState([])
  const [organizedTravels, setOrganizedTravels] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const navigate = useNavigate()
  const { userId } = useParams()

  const handleMediaQueryChanges = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true)
    } else {
      setIsSmallScreen(false)
    }
  }

  const tabs = [
    {
      title: 'Planning Travels',
      content:
  <div className={!isSmallScreen ? 'travel-cards-container' : ''}>
    {organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planning').length > 0
      ? (organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planning').map((travel, index) => {
          return <TravelCard key={index} id={travel._id} name={travel.name} startDate={travel.startDate} endDate={travel.endDate} destinations={travel.destination} atendees={travel.atendees} maxAtendees={travel.maxAtendees} profPic={travel.organizerId.profPic} />
        })
        )
      : (
        <>
          <h4>This user has no planning travels yet</h4>
        </>
        )}
  </div>
    },
    {
      title: 'Planned Travels',
      content:
  <div className={!isSmallScreen ? 'travel-cards-container' : ''}>
    {organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planned').length > 0
      ? (organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planned').map((travel, index) => {
          return <TravelCard key={index} id={travel._id} name={travel.name} startDate={travel.startDate} endDate={travel.endDate} destinations={travel.destination} atendees={travel.atendees} maxAtendees={travel.maxAtendees} profPic={travel.organizerId.profPic} />
        })
        )
      : (
        <>
          <h4>This user has no planned travels yet</h4>
        </>
        )}

  </div>
    },
    {
      title: 'Posts',
      content:
  <div className={!isSmallScreen ? 'travel-cards-container' : ''}>
    {posts.length
      ? posts.map((value, index) => {
        return <Post key={index} postId={value._id} travelId={value.travel} user={user} imageUrl={value.image} description={value.description} postUser={value.user} postLikes={value.likes} postComments={value.comments} />
      })

      : (
        <>
          <h4>This user has no posts yet</h4>
        </>
        )}

  </div>
    }
  ]

  useEffect(() => {
    const whoAmI = async () => {
      try {
        const { data } = await api.get('/users/whoami')
        if (data.error === null) {
          if (data.data.userId.toString() === userId.toString()) {
            navigate('/globetrotters/my-proffile', { replace: true })
          }
          setUser(data.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/users/prof/${userId}`)
        if (data.error === null) {
          setAtendingTravels(data.data.travelsAtending)
          setOrganizedTravels(data.data.travelsOrganizing)
          setUserProf(data.data.user)
          setPosts(data.data.posts)
          await whoAmI()
        }
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }

    fetchUserData()

    const mediaQuery = window.matchMedia('(max-width: 700px)')
    mediaQuery.addEventListener('change', handleMediaQueryChanges)
    handleMediaQueryChanges(mediaQuery)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChanges)
    }
  }, [userId, navigate])

  if (loading) {
    return (<Loader />)
  }

  return (
    <>
      <Header />
      <div className='myproffile'>

        <div className='myproffile-cont'>
          <div className='myprofile-image'>
            <img src={userProf?.profPic ? userProf.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
          </div>
          <div className='myproffile-info'>
            <h1>{userProf?.username}</h1>
            <div className='myproffile-subinfo'>
              <div>
                <h4>{computeAge(userProf?.birthDate)} years old</h4>
                <h4>{userProf?.city}, {userProf.country}</h4>
              </div>

              <div className='desc-cont'>
                <h6>Description:</h6>
                <p>{userProf?.description ? userProf?.description : 'No description'}</p>
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

export default ProffileScreen
