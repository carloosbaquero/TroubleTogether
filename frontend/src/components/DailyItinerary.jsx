import parseDate from '../utils/parseDate'
import PropTypes from 'prop-types'
import './DailyItinerary.css'
import { GrEdit } from 'react-icons/gr'
import { MdDelete } from 'react-icons/md'
import { useState } from 'react'
import api from '../utils/api'
import Modal from 'react-modal'

const DailyItinerary = ({ handleReload, travelId, itineraryId, index, itineraryProp, dateProp, dash, organizer, planned }) => {
  const [editMode, setEditMode] = useState(false)
  const [editError, setEditError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [itinerary, setItinerary] = useState(itineraryProp)
  const [date, setDate] = useState(dateProp)
  const [input, setInput] = useState({
    itinerary: itineraryProp,
    date: dateProp
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
      itinerary,
      date
    })
  }

  const handleApply = async () => {
    try {
      const { data } = await api.put(`/travels/dashboard/${travelId}/itinerary/${itineraryId}`, input)
      if (data.error === null) {
        setItinerary(data.data.itinerary)
        setDate(data.data.date)
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
      const { data } = await api.delete(`/travels/dashboard/${travelId}/itinerary/${itineraryId}`)
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
          <h3>Delete Daily Itinerary</h3>
          <br />
          <p>Do you want to delete this daily itinerary?</p>
          <br />
          <div className='modal-buttons'>
            <button className='green-button' onClick={() => setShowModal(false)}>Go back</button>
            <button className='red-button' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </Modal>

      <div className='itinerary-card' style={{ minHeight: editMode ? '350px' : '300px' }}>
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
              <MdDelete onClick={() => setShowModal(true)} className='edit-icon' />
            </div>}
          {dash && organizer && editMode &&
            <div className='dest-card-icons'>
              <button className='green-button' onClick={handleApply}>Apply</button>
              <button className='red-button' onClick={handleCancel}>Cancel</button>
            </div>}

        </div>
        {editMode
          ? (
            <>
              <div className='edit-dest-card'><h4>Date:</h4> <input type='date' name='date' value={parseDate(input.date)} onChange={handleChange} /></div>
              <div className='edit-dest-card'><textarea name='itinerary' value={input.itinerary} onChange={handleChange} /></div>
            </>)
          : (
            <>
              <h4>Date: {parseDate(date)}</h4>
              <textarea name='itinerary-info' value={itinerary} disabled />
            </>)}

      </div>
    </>
  )
}

DailyItinerary.propTypes = {
  handleReload: PropTypes.func,
  travelId: PropTypes.string.isRequired,
  itineraryId: PropTypes.string,
  index: PropTypes.number.isRequired,
  itineraryProp: PropTypes.string.isRequired,
  dateProp: PropTypes.string.isRequired,
  dash: PropTypes.bool,
  organizer: PropTypes.bool,
  planned: PropTypes.bool
}

export default DailyItinerary
