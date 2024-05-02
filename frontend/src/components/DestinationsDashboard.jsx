import { useEffect, useState } from 'react'
import DestinationCard from './DestinationCard'
import PropTypes from 'prop-types'
import { IoIosAddCircle } from 'react-icons/io'
import './DestinationsDashboard.css'
import parseDate from '../utils/parseDate'
import countries from '../utils/countries'
import api from '../utils/api'

const DestinationsDashboard = ({ handleReload, organizer, travelInfo }) => {
  const [destinations, setDestinations] = useState(() => travelInfo.destination)
  const [addMode, setAddMode] = useState(false)
  const [addError, setAddError] = useState('')
  const [input, setInput] = useState({
    city: travelInfo.city || '',
    country: travelInfo.country || 'Afghanistan',
    hotel: travelInfo.hotel,
    startDate: travelInfo.startDate || '',
    endDate: travelInfo.endDate || ''
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
      const { data } = await api.post(`/travels/dashboard/${travelInfo._id}/dest`, input)

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
    setDestinations(travelInfo.destination)
  }, [travelInfo.destination])

  return (
    <>
      <h2>Destinations {organizer ? <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /> : ''}</h2>
      <br />
      {destinations.length === 0 && !addMode && organizer && <h5>Add the first destination for your travel by clicking this button: <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /></h5>}
      {destinations.length === 0 && !addMode && !organizer && <h5>The organizer of this travel has not added a destination yet</h5>}
      <div className='destinations'>
        {addMode &&
          <div className='dest-card' style={{ maxHeight: '300px' }}>
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
              <div className='edit-dest-card'><h4>City:</h4> <input type='text' name='city' value={input.city} onChange={handleChange} /></div>
              <div className='edit-dest-card'><h4>Country:</h4> <select name='country' value={input.country} onChange={handleChange}>{countries.map((value, index) => { return (<option key={index} value={value}>{value}</option>) })}</select></div>
              <div className='edit-dest-card'><h5>Accomodation:</h5><input name='hotel' type='text' value={input.hotel} onChange={handleChange} /></div>
              <div className='edit-dest-card'><h6>Start:</h6> <input type='date' name='startDate' value={parseDate(input.startDate)} onChange={handleChange} /></div>
              <div className='edit-dest-card'><h6>End:</h6> <input type='date' name='endDate' value={parseDate(input.endDate)} onChange={handleChange} /></div>
            </>
          </div>}
        {destinations.map((value, index) => {
          return (
            <DestinationCard handleReload={handleReload} travelId={travelInfo._id} destId={value._id} key={index} index={index + 1} cityProp={value.city} countryProp={value.country} hotelProp={value.hotel} startDateProp={value.startDate} endDateProp={value.endDate} dash organizer={organizer} destinationsCount={destinations.length} />
          )
        })}
      </div>
    </>
  )
}

DestinationsDashboard.propTypes = {
  handleReload: PropTypes.func,
  travelInfo: PropTypes.object.isRequired,
  organizer: PropTypes.bool
}

export default DestinationsDashboard
