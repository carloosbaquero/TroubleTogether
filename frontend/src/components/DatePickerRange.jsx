import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePickerRange.css'

const DatePickerRange = ({ startDate, endDate, setStartDate, setEndDate, handleConfirmDate, handleCancelDate, isSmallScreen }) => {
  const today = new Date()

  const handleStartDateChange = (date) => {
    if (date > endDate) {
      setEndDate(date)
    }
    setStartDate(date)
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  return (
    <div className='modal-dates'>
      <h2>Select Dates</h2>
      <div className='date-picker-container'>
        {!isSmallScreen &&
          <>
            <div className='date-picker-wrapper'>
              <label>Start Date:</label>
              <DatePicker
                open
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat='P'
                showPopperArrow={false} // Ocultar la flecha del calendario
                customInput={<div />}
                selectsRange={false}
                minDate={today}
              />
            </div>
            <div className='date-picker-wrapper'>
              <label>End Date:</label>
              <DatePicker
                open
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                minDate={startDate}
                dateFormat='P'
                showPopperArrow={false} // Ocultar la flecha del calendario
                customInput={<div />}
                selectsRange={false}
              />
            </div>
          </>}
        {isSmallScreen &&
          <div className='date-picker-wrapper-small'>
            <label>Range of Dates:</label>
            <DatePicker
              open
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              dateFormat='P'
              showPopperArrow={false} // Ocultar la flecha del calendario
              customInput={<div />}
              selectsRange
              minDate={today}
            />
          </div>}
      </div>
      <div className='modal-buttons'>
        <button className='red-button' onClick={handleCancelDate}>Cancel</button>
        <button className='green-button' onClick={handleConfirmDate}>Apply</button>
      </div>
    </div>
  )
}

DatePickerRange.propTypes = {
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  handleCancelDate: PropTypes.func.isRequired,
  handleConfirmDate: PropTypes.func.isRequired,
  isSmallScreen: PropTypes.bool.isRequired
}
export default DatePickerRange
