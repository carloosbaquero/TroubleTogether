import { useEffect, useState } from 'react'
import { IoClose, IoMenu, IoHomeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import api from '../utils/api'
import { deleteAccessToken, deleteRefreshToken, getAccessToken, getRefreshToken } from '../utils/authHelpers'
import { MdOutlineTravelExplore, MdLogout, MdLogin } from 'react-icons/md'
import { ImUsers } from 'react-icons/im'
import { GrPlan } from 'react-icons/gr'

const Header = () => {
  const navigate = useNavigate()
  const [isNavVisible, setIsNavVisible] = useState(false)
  const [userId, setUserId] = useState('')
  const [profPic, setProfPic] = useState('/default-profile-pic.jpg')
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        await api.delete('/users/logout', { data: { refreshToken } })
      }
      deleteAccessToken()
      deleteRefreshToken()
      navigate('/globetrotters/sign', { replace: true })
    } catch (err) {
      console.log(err)
    }
  }

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible)
  }

  const handleMediaQueryChanges = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true)
    } else {
      setIsSmallScreen(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        if (getAccessToken() && getRefreshToken()) {
          const { data } = await api.get('/users/whoami')
          setUserId(data.data.userId)
          setProfPic(data.data.profPic)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getUser()
    const mediaQuery = window.matchMedia('(max-width: 900px)')
    mediaQuery.addEventListener('change', handleMediaQueryChanges)
    handleMediaQueryChanges(mediaQuery)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChanges)
    }
  }, [])

  return (
    <header className={`header ${isSmallScreen && isNavVisible ? 'height' : ''}`}>
      <img src='/final-logo.svg' className='logo' alt='logo' />
      {(isNavVisible || !isSmallScreen) &&
        <nav className='nav-header'>
          <div className='nav-button' onClick={() => navigate('/globetrotters')}><span><IoHomeOutline /> Home</span></div>
          <div className='nav-button' onClick={() => navigate('/globetrotters/travels')}><span><MdOutlineTravelExplore /> Search for a travel</span></div>
          <div className='nav-button' onClick={() => navigate('/globetrotters/community')}><span><ImUsers /> Community</span></div>
          <div className='nav-button' onClick={() => navigate('/globetrotters/create-travel')}><span><GrPlan /> Plan your next travel</span></div>
          {userId &&
            <div className='nav-button' onClick={() => navigate('/globetrotters/my-proffile')}>
              <div className='profile-picture-header'>
                <img src={profPic || '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
              </div>
              <span>
                My Profile
              </span>
            </div>}
          {getAccessToken() && getRefreshToken()
            ? <div className='logout-button' onClick={handleLogout}><span><MdLogout /> Log out</span></div>
            : <div className='login-button' onClick={() => navigate('/globetrotters/sign')}><span><MdLogin /> Sign in</span></div>}
        </nav>}
      {!isNavVisible && <IoMenu className='menu' onClick={toggleNav} />}
      {isNavVisible && <IoClose className='menu' onClick={toggleNav} />}

    </header>
  )
}

export default Header
