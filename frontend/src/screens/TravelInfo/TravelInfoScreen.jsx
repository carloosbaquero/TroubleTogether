import { useEffect, useState } from 'react'
import AtendeesList from '../../components/AtendeesList'
import Header from '../../components/Header'
import './TravelInfo.css'
import api from '../../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import parseDate from '../../utils/parseDate'
import DestinationCard from '../../components/DestinationCard'
import { getAccessToken, getRefreshToken } from '../../utils/authHelpers'
import Modal from 'react-modal'
import Loader from '../../components/Loader'

const TravelInfoScreen = () => {
  const [travelInfo, setTravelInfo] = useState({})
  const { travelId } = useParams()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [successRequest, setSuccessRequest] = useState(false)
  const [errorRequest, setErrorRequest] = useState(false)
  const [userId, setUserId] = useState('')
  const [requested, setRequested] = useState(false)
  const [shouldNavigate, setShouldNavigate] = useState(false)

  const navigate = useNavigate()

  const handleRequest = async () => {
    try {
      if (getAccessToken() && getRefreshToken()) {
        const { data } = await api.post(`/requests/travel/${travelId}/request`)
        if (data.error === null) {
          setSuccessRequest(true)
          setErrorRequest(true)
        }
      } else {
        setErrorRequest(true)
      }
    } catch (err) {
      console.log(err)
      setErrorRequest(true)
    }
  }

  useEffect(() => {
    const getTravelInfo = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/travels/info/${travelId}`)
        const resTravelInfo = data.data
        setTravelInfo(resTravelInfo)
        setRequested(resTravelInfo.requests.some(request => request.user === userId))

        if (getAccessToken() && getRefreshToken()) {
          const { data } = await api.get('/users/whoami')
          setUserId(prevUserId => {
            if (data.data.userId === resTravelInfo.organizerId._id || resTravelInfo.atendees.some(atendee => atendee._id === prevUserId)) {
              setShouldNavigate(true)
            } else {
              setLoading(false)
            }
            return data.data.userId
          })
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.log(err)
      }
    }

    getTravelInfo()
  }, [travelId, requested, userId])

  useEffect(() => {
    if (shouldNavigate) {
      navigate(`/globetrotters/travels/${travelId}/dashboard`, { replace: true })
      setLoading(false)
    }
  }, [shouldNavigate, navigate, travelId])

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
          <h3>Join Request</h3>
          <br />
          {successRequest
            ? (
              <>
                <p>Your request has been sucessfully sent</p>
                <br />
                <button className='green-button' onClick={() => setShowModal(false)}>OK</button>
              </>
              )
            : (
              <>
                {errorRequest
                  ? (
                    <>
                      <p>You need to be logged to request to join this trip</p>
                      <br />
                      <div className='modal-buttons'>
                        <button className='red-button' onClick={() => setShowModal(false)}>Cancel</button>
                        <button className='green-button' onClick={() => navigate('/globetrotters/sign')}>Log In</button>
                      </div>
                    </>
                    )
                  : (
                    <>
                      <p>Do you want to request to join this trip?</p>
                      <br />
                      <div className='modal-buttons'>
                        <button className='green-button' onClick={() => setShowModal(false)}>Cancel</button>
                        <button className='green-button' onClick={handleRequest}>Request</button>
                      </div>
                    </>
                    )}

              </>
              )}

        </div>
      </Modal>
      <Header />
      <div className='contents'>
        <h1>{travelInfo.name}</h1>
        <hr />
        <div className='travel-info'>

          <div className='info'>

            <h3>Description:</h3>
            <h3>{travelInfo.description}</h3>
            <br />
            <h5>Start: {parseDate(travelInfo.startDate)}</h5>
            <h5>End: {parseDate(travelInfo.endDate)}</h5>
            <hr />
            <h2>Destinations</h2>
            <div className='destinations'>
              {travelInfo.destination.map((value, index) => {
                return (
                  <DestinationCard travelId={travelId} key={index} index={index + 1} cityProp={value.city} countryProp={value.country} hotelProp={value.hotel} startDateProp={value.startDate} endDateProp={value.endDate} />
                )
              })}
            </div>
          </div>
          <div className='atendees'>
            <AtendeesList organizer={travelInfo.organizerId} maxAtendees={travelInfo.maxAtendees} minAtendees={travelInfo.minAtendees} atendees={travelInfo.atendees} />
            {!(userId === travelInfo.organizerId._id || travelInfo.atendees.some(atendee => atendee._id === userId)) && !requested &&
              <button className='green-button' onClick={() => setShowModal(true)}>Request to join</button>}

            {requested && !(userId === travelInfo.organizerId._id || travelInfo.atendees.some(atendee => atendee._id === userId)) &&
              <p>Your request needs to be reviewed</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default TravelInfoScreen
