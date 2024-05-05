import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { IoIosAddCircle } from 'react-icons/io'
import parseDate from '../utils/parseDate'
import api from '../utils/api'
import DailyItinerary from './DailyItinerary'
import './DailyItinerary.css'

const ItineraryDashboard = ({ handleReload, organizer, travelInfo, planned }) => {
  const [itinerary, setItinerary] = useState(() => travelInfo.itinerary)
  const [addMode, setAddMode] = useState(false)
  const [addError, setAddError] = useState('')
  const [input, setInput] = useState({
    itinerary: '',
    date: travelInfo.startDate
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setInput(prevInput => ({
      ...prevInput,
      [name]: value
    }))
  }

  const handleAdd = async () => {
    try {
      const { data } = await api.post(`/travels/dashboard/${travelInfo._id}/itinerary`, input)

      if (data.error === null) {
        setInput({})
        setAddMode(false)
        handleReload()
      }
    } catch (err) {
      console.log(err)
      setAddError(err.response.data.error)
    }
  }

  useEffect(() => {
    setItinerary(travelInfo.itinerary)
  }, [travelInfo.itinerary])

  return (
    <>
      <h2>Itinerary {organizer && !planned ? <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /> : ''}</h2>
      <br />
      {itinerary.length === 0 && !addMode && organizer && !planned && <h5>Start planning the itinerary for your travel by clicking this button: <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /></h5>}
      {itinerary.length === 0 && !addMode && !organizer && !planned && <h5>The organizer of this travel has not added an itinerary yet</h5>}
      {itinerary.length === 0 && planned && <h5>This travel has no itinerary</h5>}
      <div className='destinations'>
        {addMode &&
          <div className='itinerary-card'>
            {addError &&
              <>
                <p className='error-message'>{addError}</p>
              </>}
            <div className='dest-card-top'>
              <div className='circle'>
                <span className='number'>0</span>
              </div>
              <div className='dest-card-icons'>
                <button className='green-button' onClick={handleAdd}>Add</button>
                <button className='red-button' onClick={() => setAddMode(false)}>Cancel</button>
              </div>
            </div>
            <br />
            <>
              <div className='edit-dest-card'><h4>Date:</h4> <input type='date' name='date' value={parseDate(input.date)} onChange={handleChange} /></div>
              <div className='edit-dest-card'><textarea name='itinerary' type='text' value={input.itinerary} onChange={handleChange} /></div>
            </>
          </div>}
        {itinerary.map((value, index) => {
          return (
            <DailyItinerary handleReload={handleReload} travelId={travelInfo._id} itineraryId={value._id} key={index} index={index + 1} itineraryProp={value.itinerary} dateProp={value.date} dash organizer={organizer} planned={planned} />
          )
        })}
      </div>
    </>
  )
}

ItineraryDashboard.propTypes = {
  handleReload: PropTypes.func,
  travelInfo: PropTypes.object.isRequired,
  organizer: PropTypes.bool,
  planned: PropTypes.bool
}

export default ItineraryDashboard
