import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import api from '../../utils/api'
import Post from '../../components/Post'
import { getAccessToken, getRefreshToken } from '../../utils/authHelpers'
import './Community.css'
import UserCard from '../../components/UserCard'
import { useNavigate } from 'react-router-dom'

const CommunityScreen = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [beforeSearch, setBeforeSearch] = useState('')
  const [search, setSearch] = useState('')
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [profPic, setProfPic] = useState('/default-profile-pic.jpg')
  const [showButton, setShowButton] = useState(false)
  const [shouldReload, setShouldReload] = useState(false)

  const navigate = useNavigate()

  const handleReload = () => {
    setShouldReload(prevState => !prevState)
  }

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        setLoading(true)
        if (search) {
          const { data } = await api.get(`users/community?search=${search.trim()}`)
          if (data.error === null) {
            setPosts(data.data.posts)
            setUsers(data.data.users)
            if (getAccessToken() && getRefreshToken()) {
              const { data } = await api.get('/users/whoami')
              setUserId(data.data.userId)
              setProfPic(data.data.profPic)
              setUsername(data.data.username)
            }
          }
        } else {
          const { data } = await api.get('travels/posts')
          if (data.error === null) {
            setPosts(data.data)
            setUsers([])
            if (getAccessToken() && getRefreshToken()) {
              const { data } = await api.get('/users/whoami')
              setUserId(data.data.userId)
              setProfPic(data.data.profPic)
              setUsername(data.data.username)
            }
          }
        }
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }
    getAllPosts()
    const mediaQuery = window.matchMedia('(max-width: 700px)')
    mediaQuery.addEventListener('change', handleMediaQueryChanges)
    handleMediaQueryChanges(mediaQuery)

    const handleScroll = () => {
      if (window.scrollY > 200) { // Cambia este valor según la distancia de desplazamiento que desees
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChanges)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [search, shouldReload])

  const handleMediaQueryChanges = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true)
    } else {
      setIsSmallScreen(false)
    }
  }

  const handleSearch = async () => {
    setSearch(beforeSearch)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <>
      <Header />
      {showButton && <button className='fixed-button' onClick={scrollToTop}>↑</button>}
      <div className='travels'>
        <h1>Have you planned a travel? Share your experience to join our community</h1>
        <p>Here you can find every post that other users shared about their already planned travels. Also, you can find your friends by their username using the search bar.</p>
        <div className='search-container'>
          <input type='text' placeholder='Search user...' className='search-input' onChange={e => setBeforeSearch(e.target.value)} onKeyDown={k => k.key === 'Enter' ? handleSearch() : ''} />
          <button className='green-button' onClick={handleSearch}>Search</button>
        </div>
        {loading
          ? (
            <>
              <br />
              <br />
              <Loader />
            </>
            )
          : (
            <>
              {(posts.length === 0 && users.length === 0)
                ? (
                  <>
                    <br />
                    <br />
                    {!search && <h4>There are no Posts available. If you have already planned a travel, you can share your own post!</h4>}
                    {search && <h4>We can not find a User with that username. Please change it and try it again with</h4>}
                  </>
                  )
                : (
                  <div className='community'>
                    {posts.length > 0 && posts.map((value, index) => {
                      return (
                        <Post key={index} postId={value._id} travelId={value.travel} user={{ userId, username, profPic }} imageUrl={value.image} description={value.description} postUser={value.user} postLikes={value.likes} postComments={value.comments} handleReload={handleReload} />
                      )
                    })}
                    {users.length > 0 && users.map((u, index) => {
                      return (
                        <UserCard key={index} user={u} navigate={navigate} />
                      )
                    })}
                  </div>)}
            </>
            )}
      </div>
    </>
  )
}

export default CommunityScreen
