import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { IoIosAddCircle } from 'react-icons/io'
import api from '../utils/api'
import './DailyItinerary.css'
import SuggestionCard from './SuggestionCard'

const SuggestionDashboard = ({ handleReload, participant, travelInfo }) => {
  const [suggestions, setSuggestions] = useState(() => travelInfo.suggestions)
  const [addMode, setAddMode] = useState(false)
  const [addError, setAddError] = useState('')
  const [input, setInput] = useState({
    description: ''
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
      const { data } = await api.post(`/travels/dashboard/${travelInfo._id}/suggestion`, input)

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
    setSuggestions(travelInfo.suggestions)
  }, [travelInfo.suggestions])

  return (
    <>
      <h2>Suggestions <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /></h2>
      <br />
      {suggestions.length === 0 && !addMode && <h5>You can make suggestions for your travel by clicking this button: <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /></h5>}
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
              <div className='edit-dest-card'><textarea name='description' type='text' value={input.description} onChange={handleChange} /></div>
            </>
          </div>}
        {suggestions.map((value, index) => {
          return (
            <SuggestionCard handleReload={handleReload} travelId={travelInfo._id} suggestionId={value._id} descriptionProp={value.description} suggestionUser={value.user} key={index} dash participant={participant} approvationsProp={value.approvations} />
          )
        })}
      </div>
    </>
  )
}

SuggestionDashboard.propTypes = {
  handleReload: PropTypes.func,
  travelInfo: PropTypes.object.isRequired,
  participant: PropTypes.object.isRequired
}

export default SuggestionDashboard
