import Header from '../../components/Header'
import TravelCard from '../../components/TravelCard'
import api from '../../utils/api'
import { useEffect, useState } from 'react'
import './Travels.css'
import '../../components/Button.css'
import Modal from 'react-modal'
import countries from '../../utils/countries.js'
import DatePickerRange from '../../components/DatePickerRange.jsx'
import Loader from '../../components/Loader.jsx'
import Paginator from '../../components/Paginator.jsx'

Modal.setAppElement('#root')

const TravelScreen = () => {
  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)

  const [travels, setTravels] = useState([])
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const [search, setSearch] = useState('')
  const [querySearch, setQuerySearch] = useState('')
  const [selectedCountries, setSelectedCountries] = useState([])
  const [queryCountries, setQueryCountries] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(nextWeek)
  const [queryDates, setQueryDates] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [showCountries, setShowCountries] = useState(false)
  const [showDates, setShowDates] = useState(false)

  const [loading, setLoading] = useState(true)

  const handleModalCountries = () => {
    setShowCountries(!showCountries)
  }
  const handleModalDates = () => {
    setShowDates(!showDates)
  }

  const handleSearch = () => {
    setQuerySearch(search)
  }

  const handleMediaQueryChanges = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true)
    } else {
      setIsSmallScreen(false)
    }
  }

  const handleCountryChange = (e) => {
    const { value, checked } = e.target
    setSelectedCountries(prevSelectedCountries => {
      if (checked) {
        return [...prevSelectedCountries, value]
      } else {
        return prevSelectedCountries.filter(country => country !== value)
      }
    })
  }

  const handleCountriesCancel = () => {
    setSelectedCountries([])
    setQueryCountries('')
    setShowCountries(false)
  }

  const handleCountriesApply = () => {
    setQueryCountries(selectedCountries.join(','))
    setShowCountries(false)
  }

  const handleConfirmDate = () => {
    if (startDate && endDate) {
      const formattedStartDate = startDate.toISOString()
      const formattedEndDate = endDate.toISOString()
      setQueryDates(`startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
    } else {
      console.error('Please select both start and end dates.')
    }
    setShowDates(false)
  }

  const handleCancelDate = () => {
    setQueryDates('')
    setShowDates(false)
  }

  const handleDeleteFilters = () => {
    setQueryCountries('')
    setQueryDates('')
    setQuerySearch('')
  }

  useEffect(() => {
    const getTravels = async () => {
      setLoading(true)
      try {
        let queryString = ''
        if (querySearch) {
          queryString += `search=${querySearch}`
        }
        if (queryCountries) {
          queryString += `${queryString ? '&' : ''}country=${queryCountries}`
        }
        if (queryDates) {
          queryString += `${queryString ? '&' : ''}${queryDates}`
        }

        const { data } = await api.get(`travels/travel?page=${page}&${queryString ? `${queryString}` : ''}`)
        setTravels(data.data)
        setTotal(data.total)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }

    getTravels()

    const mediaQuery = window.matchMedia('(max-width: 700px)')
    mediaQuery.addEventListener('change', handleMediaQueryChanges)
    handleMediaQueryChanges(mediaQuery)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChanges)
    }
  }, [querySearch, queryCountries, queryDates, page])

  return (
    <>
      <Modal
        isOpen={showDates} style={{
          overlay: {
            zIndex: 3
          },
          content: {
            height: '480px'
          }
        }}
      >
        <DatePickerRange
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleConfirmDate={handleConfirmDate}
          handleCancelDate={handleCancelDate}
          isSmallScreen={isSmallScreen}
        />
      </Modal>
      <Modal
        isOpen={showCountries} style={{
          overlay: {
            zIndex: 3
          }
        }}
      >
        <div className='modal-container'>
          <h3>Filter by Country:</h3>
          <div className={isSmallScreen ? 'travels-container' : 'modal-countries'}>

            {countries.map(country => (
              <div key={country}>
                <input
                  type='checkbox'
                  id={country}
                  value={country}
                  checked={selectedCountries.includes(country)}
                  onChange={handleCountryChange}
                />
                <label htmlFor={country}>{' ' + country}</label>
              </div>
            ))}
          </div>
          <div className='modal-buttons'>
            <button className='red-button' onClick={handleCountriesCancel}>Cancel</button>
            <button className='green-button' onClick={handleCountriesApply}>Apply</button>
          </div>

        </div>
      </Modal>

      <Header />
      <div className='travels'>
        <h1>Looking for a destination?</h1>
        <p>Here you can search for planning travels created by other users.
          If you can not find your ideal travel, you can always <a href='/globetrotters/create-travel'>Plan it yourself.</a>
        </p>
        <p>If you want to find travels that start more than 3 years from now, you should use the 'Dates Filter'</p>
        <div className='search-container'>
          <input
            type='text' placeholder='Search...' className='search-input'
            onChange={e => setSearch(e.target.value)} onKeyDown={k => k.key === 'Enter' ? handleSearch() : ''}
          />
          <button className='green-button' onClick={handleSearch}>Search</button>
        </div>

        <div className='filters-block'>
          <h3>Filter By:</h3>
          <button className='green-button' onClick={handleModalCountries}>Countries</button>
          <button className='green-button' onClick={handleModalDates}>Dates</button>
          <button className='red-button' onClick={handleDeleteFilters}>Delete filters</button>
        </div>
        {loading
          ? (
            <>
              <br />
              <br />
              <Loader />
            </>
            )
          : (
            <>
              {travels.length === 0
                ? (
                  <>
                    <br />
                    <br />
                    <h4>There are no travels with these filters. You can plan it yourself!</h4>
                  </>
                  )
                : (
                  <div className={!isSmallScreen ? 'travel-cards-container' : ''}>
                    {travels.length > 0 && travels.map((travel, index) => {
                      return (
                        <TravelCard
                          key={index} id={travel._id} name={travel.name} startDate={travel.startDate}
                          endDate={travel.endDate} destinations={travel.destination} atendees={travel.atendees}
                          maxAtendees={travel.maxAtendees}
                          profPic={travel.organizerId.profPic ? travel.organizerId.profPic : '/default-profile-pic.jpg'}
                        />
                      )
                    })}

                  </div>)}
            </>
            )}
        <Paginator page={page} setPage={setPage} total={total} />
      </div>
    </>
  )
}

export default TravelScreen
