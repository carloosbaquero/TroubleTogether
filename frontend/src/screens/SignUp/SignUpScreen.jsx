import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignUp.css'
import api from '../../utils/api'
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../../utils/authHelpers'
import countries from '../../utils/countries'

const SignUpScreen = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false)

  const [emailLogIn, setEmailLogIn] = useState('')
  const [passLogIn, setPassLogIn] = useState('')
  const [errorLogIn, setErrorLogIn] = useState(null)

  const [username, setUsername] = useState('')
  const [emailSignUp, setEmailSignUp] = useState('')
  const [passSignUp, setPassSignUp] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [errorSignUp, setErrorSignUp] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    if (accessToken && refreshToken) {
      navigate('/globetrotters')
    }
  }, [navigate])

  const handleLogIn = async (event) => {
    event.preventDefault()

    try {
      const { data } = await api.post('/users/login', {
        email: emailLogIn,
        password: passLogIn
      })
      if (data.error === null) {
        setAccessToken(data.data.accessToken)
        setRefreshToken(data.data.refreshToken)
        navigate('/globetrotters')
      } else {
        console.log(data.error)
        setErrorLogIn(data.error)
      }
    } catch (err) {
      console.log(err.response.data.error)
      setErrorLogIn(err.response.data.error)
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()

    try {
      const { data } = await api.post('/users/register', {
        username,
        email: emailSignUp,
        password: passSignUp,
        birthDate,
        city,
        country
      })
      console.log(data)
      if (data.status === 200) {
        console.log('success')
      } else {
        console.log(data.error)
        setErrorLogIn(data.error)
      }
    } catch (err) {
      console.log(err.response.data.error)
      setErrorSignUp(err.response.data.error)
    }
  }

  const handleSignUpClick = () => {
    setIsSignUpMode(true)
  }

  const handleSignInClick = () => {
    setIsSignUpMode(false)
  }

  return (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className='forms-container'>
        <div className='signin-signup'>
          <form id='sign-in' className='sign-in-form' onSubmit={handleLogIn}>
            <h2 className='title'>Log in</h2>
            <div className='input-field'>
              <i className='fas fa-user' />
              <input value={emailLogIn} type='email' placeholder='Email' onChange={e => setEmailLogIn(e.target.value)} autoComplete='email' />
            </div>
            <div className='input-field'>
              <i className='fas fa-lock' />
              <input value={passLogIn} type='password' placeholder='Password' onChange={e => setPassLogIn(e.target.value)} />
            </div>
            <p className='error-message'>{errorLogIn}</p>
            <input type='submit' value='Login' className='btn solid' />
          </form>
          <form id='sign-up' className='sign-up-form' onSubmit={handleSignUp}>
            <h2 className='title'>Sign up</h2>

            <div className='input-field'>
              <i className='fas fa-user' />
              <input value={username} type='text' placeholder='Username' onChange={e => setUsername(e.target.value)} />
            </div>
            <div className='input-field'>
              <i className='fas fa-envelope' />
              <input value={emailSignUp} type='email' placeholder='Email' onChange={e => setEmailSignUp(e.target.value)} autoComplete='email' />
            </div>
            <div className='input-field'>
              <i className='fas fa-lock' />
              <input value={passSignUp} type='password' placeholder='Password' onChange={e => setPassSignUp(e.target.value)} />
            </div>
            <div className='input-field'>
              <i className='fas fa-lock' />
              <input className='signup-birthdate' value={birthDate} type='date' placeholder='Birth date' onChange={e => setBirthDate(e.target.value)} />
            </div>

            <div className='input-line'>
              <div className='input-field'>
                <i className='fas fa-lock' />
                <input value={city} type='text' placeholder='City' onChange={e => setCity(e.target.value)} />
              </div>
              <div className='input-field'>
                <i className='fas fa-lock' />
                <select value={country} type='text' placeholder='Country' onChange={e => setCountry(e.target.value)}>
                  <option value=''>Select a country</option>
                  {countries.map((value, index) => {
                    return (
                      <option key={index} value={value}>{value}</option>
                    )
                  })}
                </select>
              </div>
            </div>
            <p className='error-message'>{errorSignUp}</p>
            <input type='submit' className='btn' value='Sign up' />
          </form>
        </div>
      </div>

      <div className='panels-container'>
        <div className='panel left-panel'>
          <div className='content'>
            <h3>Don`t have an account ?</h3>
            <p>
              Join our community to get the trip that you`ve always wished for!
            </p>
            <button className='btn transparent' onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
        </div>
        <div className='panel right-panel'>
          <div className='content'>
            <h3>Already have an account ?</h3>
            <p>
              Welcome again, a new trip is waiting for you to be organised.
            </p>
            <button className='btn transparent' onClick={handleSignInClick}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpScreen
