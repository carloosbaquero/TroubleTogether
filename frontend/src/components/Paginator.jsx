import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'
import './Paginator.css'
import PropTypes from 'prop-types'

const Paginator = ({ page, setPage, total }) => {
  const handleNext = () => {
    if (total - page * 10 > 10) {
      setPage(page + 1)
    }
  }

  const handleBefore = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  return (
    <div className='paginator'>
      {page > 1 && <HiArrowCircleLeft className='paginator-element' onClick={handleBefore} />}
      <p>Page {page}</p>
      {total - page * 10 > 10 && <HiArrowCircleRight className='paginator-element' onClick={handleNext} />}
    </div>
  )
}

Paginator.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
}

export default Paginator
