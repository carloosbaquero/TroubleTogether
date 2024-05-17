import parseDate from '../utils/parseDate'
import PropTypes from 'prop-types'
import './DestinationCard.css'
import { GrEdit } from 'react-icons/gr'
import { MdDelete } from 'react-icons/md'
import { useState } from 'react'
import countries from '../utils/countries'
import api from '../utils/api'
import Modal from 'react-modal'

const DestinationCard = ({ handleReload, travelId, destId, index, cityProp, countryProp, hotelProp, startDateProp, endDateProp, dash, organizer, destinationsCount, planned }) => {
  const [editMode, setEditMode] = useState(false)
  const [editError, setEditError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [city, setCity] = useState(cityProp)
  const [country, setCountry] = useState(countryProp)
  const [hotel, setHotel] = useState(hotelProp)
  const [startDate, setStartDate] = useState(startDateProp)
  const [endDate, setEndDate] = useState(endDateProp)
  const [input, setInput] = useState({
    city: cityProp,
    country: countryProp,
    hotel: hotelProp,
    startDate: startDateProp,
    endDate: endDateProp
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setInput(prevInput => ({
      ...prevInput,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setEditMode(false)
    setInput({
      city,
      country,
      hotel,
      startDate,
      endDate
    })
  }

  const handleApply = async () => {
    try {
      const { data } = await api.put(`/travels/dashboard/${travelId}/dest/${destId}`, input)
      if (data.error === null) {
        setCity(data.data.city)
        setCountry(data.data.country)
        setHotel(data.data.hotel)
        setStartDate(data.data.startDate)
        setEndDate(data.data.endDate)
        setEditMode(false)
        handleReload()
      }
    } catch (err) {
      console.log(err)
      setEditError(err.response.data.error)
    }
  }

  const handleDelete = async () => {
    try {
      const { data } = await api.delete(`/travels/dashboard/${travelId}/dest/${destId}`)
      if (data.error === null) {
        setShowModal(false)
        handleReload()
      }
    } catch (err) {

    }
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
          <h3>Delete Destination</h3>
          <br />
          <p>Do you want to delete this destination?</p>
          <br />
          <div className='modal-buttons'>
            <button className='green-button' onClick={() => setShowModal(false)}>Go back</button>
            <button className='red-button' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </Modal>

      <div className='dest-card' style={{ maxHeight: editMode ? '300px' : '200px' }}>
        {editError && editMode &&
          <>
            <p className='error-message'>{editError}</p>
          </>}

        <div className='dest-card-top'>
          <div className='circle'>
            <span className='number'>{index}</span>
          </div>
          {dash && organizer && !editMode && !planned &&
            <div className='dest-card-icons'>
              <GrEdit onClick={() => setEditMode(true)} className='edit-icon' />
              {destinationsCount > 1 && <MdDelete onClick={() => setShowModal(true)} className='edit-icon' />}
            </div>}
          {dash && organizer && editMode &&
            <div className='dest-card-icons'>
              <button className='green-button' onClick={handleApply}>Apply</button>
              <button className='red-button' onClick={handleCancel}>Cancel</button>
            </div>}

        </div>
        <br />
        {editMode
          ? (
            <>
              <div className='edit-dest-card'><h4>City:</h4> <input type='text' name='city' value={input.city} onChange={handleChange} /></div>
              <div className='edit-dest-card'><h4>Country:</h4> <select name='country' value={input.country} onChange={handleChange}>{countries.map((value, index) => { return (<option key={index} value={value}>{value}</option>) })}</select></div>
              <div className='edit-dest-card'><h5>Accomodation:</h5><input name='hotel' type='text' value={input.hotel} onChange={handleChange} /></div>
              <div className='edit-dest-card'><h6>Start:</h6> <input type='date' name='startDate' value={parseDate(input.startDate)} onChange={handleChange} /></div>
              <div className='edit-dest-card'><h6>End:</h6> <input type='date' name='endDate' value={parseDate(input.endDate)} onChange={handleChange} /></div>
            </>)
          : (
            <>
              <h4>City: {city}</h4>
              <h4>Country: {country}</h4>
              {hotel && <h5>Accomodation: {hotel}</h5>}
              <h6>Start: {parseDate(startDate)}</h6>
              <h6>End: {parseDate(endDate)}</h6>
            </>)}

      </div>
    </>
  )
}

DestinationCard.propTypes = {
  handleReload: PropTypes.func,
  travelId: PropTypes.string.isRequired,
  destId: PropTypes.string,
  index: PropTypes.number.isRequired,
  cityProp: PropTypes.string.isRequired,
  countryProp: PropTypes.string.isRequired,
  hotelProp: PropTypes.string,
  startDateProp: PropTypes.string.isRequired,
  endDateProp: PropTypes.string.isRequired,
  dash: PropTypes.bool,
  organizer: PropTypes.bool,
  destinationsCount: PropTypes.number,
  planned: PropTypes.bool
}

export default DestinationCard
