import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import './Proffile.css'
import api from '../../utils/api'
import TravelCard from '../../components/TravelCard'
import computeAge from '../../utils/computeAge'
import Loader from '../../components/Loader'
import { GrEdit } from 'react-icons/gr'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import Modal from 'react-modal'
import * as Yup from 'yup'
import countries from '../../utils/countries'
import parseDate from '../../utils/parseDate'
import Post from '../../components/Post'

const MyProffileScreen = () => {
  const [user, setUser] = useState({})
  const [atendingTravels, setAtendingTravels] = useState([])
  const [organizedTravels, setOrganizedTravels] = useState([])
  const [posts, setPosts] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editError, setEditError] = useState('')
  const [input, setInput] = useState()
  const [loading, setLoading] = useState(true)
  const [shouldReload, setShouldReload] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('/default-profile-pic.jpg')
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const validationSchema = Yup.object().shape({
    image: Yup.string(),
    description: Yup.string().required('Description is required'),
    birthDate: Yup.date().max(new Date()).required('Start Date is required'),
    country: Yup.string().oneOf(countries, 'Invalid Country').required('Country is required'),
    city: Yup.string().max(30).required('City is required')
  })

  const handleReload = () => {
    setShouldReload(prevState => !prevState)
  }

  const handleMediaQueryChanges = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true)
    } else {
      setIsSmallScreen(false)
    }
  }

  const handleEdit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData()
      if (previewUrl !== '/default-profile-pic.jpg' && previewUrl !== user?.profPic) formData.append('image', selectedFile)
      formData.append('description', values.description)
      formData.append('birthDate', values.birthDate)
      formData.append('city', values.city)
      formData.append('country', values.country)
      const { data } = await api.put('/users/my-prof', formData)
      if (data.error === null) {
        setEditMode(false)
        handleReload()
      }
    } catch (err) {
      console.log(err)
      setEditError(err.response.data.error)
    } finally {
      setSubmitting(true)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    {
      title: 'Planning Travels',
      content:
  <div className={!isSmallScreen ? 'travel-cards-container' : ''}>
    {organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planning').length > 0
      ? (organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planning').map((travel, index) => {
          return <TravelCard key={index} id={travel._id} name={travel.name} startDate={travel.startDate} endDate={travel.endDate} destinations={travel.destination} atendees={travel.atendees} maxAtendees={travel.maxAtendees} profPic={travel.organizerId.profPic} />
        })
        )
      : (
        <>
          <h4>This user has no planning travels yet</h4>
        </>
        )}
  </div>
    },
    {
      title: 'Planned Travels',
      content:
  <div className={!isSmallScreen ? 'travel-cards-container' : ''}>
    {organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planned').length > 0
      ? (organizedTravels.concat(atendingTravels).filter(t => t.state === 'Planned').map((travel, index) => {
          return <TravelCard key={index} id={travel._id} name={travel.name} startDate={travel.startDate} endDate={travel.endDate} destinations={travel.destination} atendees={travel.atendees} maxAtendees={travel.maxAtendees} profPic={travel.organizerId.profPic} />
        })
        )
      : (
        <>
          <h4>This user has no planned travels yet</h4>
        </>
        )}

  </div>
    },
    {
      title: 'Posts',
      content:
  <div className={!isSmallScreen ? 'travel-cards-container' : ''}>
    {posts.length
      ? posts.map((value, index) => {
        return <Post key={index} postId={value._id} travelId={value.travel} user={{ userId: user._id, username: user.username, profPic: user.profPic }} imageUrl={value.image} description={value.description} postUser={value.user} postLikes={value.likes} postComments={value.comments} handleReload={handleReload} />
      })

      : (
        <>
          <h4>This user has no posts yet</h4>
        </>
        )}

  </div>
    }
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/users/my-prof')
        setPreviewUrl(data.data.user.profPic ? data.data.user.profPic : '/default-profile-pic.jpg')
        setInput({ description: data.data.user.description, birthDate: parseDate(data.data.user.birthDate), country: data.data.user.country, city: data.data.user.city })
        setAtendingTravels(data.data.travelsAtending)
        setOrganizedTravels(data.data.travelsOrganizing)
        setUser(data.data.user)
        setPosts(data.data.posts)
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUserData()

    const mediaQuery = window.matchMedia('(max-width: 700px)')
    mediaQuery.addEventListener('change', handleMediaQueryChanges)
    handleMediaQueryChanges(mediaQuery)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChanges)
    }
  }, [shouldReload])

  if (loading) {
    return (<Loader />)
  }

  return (
    <>
      <Modal
        isOpen={editMode} style={{
          overlay: {
            zIndex: 3
          }
        }}
      >
        <Formik
          initialValues={input}
          validationSchema={validationSchema}
          onSubmit={handleEdit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className='create-travel' style={{ marginTop: '0px' }}>
              <h1>Edit your proffile</h1>
              <div>
                <label>Picture:</label>
                <div className='edit-prof-pic'>
                  <input
                    type='file'
                    accept='image/*'
                    id='profile-pic-input'
                    onChange={handleFileChange}
                  />
                  <label htmlFor='profile-pic-input'>
                    <img
                      id='profile-pic-preview'
                      src={previewUrl}
                      alt='Profile Preview'
                    />
                  </label>
                </div>

                <label htmlFor='userDesc'>Description:</label>
                <Field as='textarea' id='userDesc' name='description' />
                <ErrorMessage name='description' component='div' className='error' />

                <div className='form-group'>
                  <div>
                    <label htmlFor='birthDate'>Birth Date:</label>
                    <Field type='date' id='birthDate' name='birthDate' />
                    <ErrorMessage name='birthDate' component='div' className='error' />
                  </div>

                  <div>
                    <label htmlFor='city'>City:</label>
                    <Field type='text' min={2} max={30} id='city' name='city' />
                    <ErrorMessage name='city' component='div' className='error' />
                  </div>
                  <div>
                    <label htmlFor='country'>Country:</label>
                    <Field as='select' id='country' name='country'>
                      {countries.map((value, index) => {
                        return (
                          <option key={index} value={value}>{value}</option>
                        )
                      })}
                    </Field>
                    <ErrorMessage name='country' component='div' className='error' />
                  </div>

                </div>
              </div>
              <p className='error-message'>{editError}</p>
              <br />
              <div className='modal-buttons'>
                <button className='red-button' onClick={() => setEditMode(false)}>Cancel</button>
                <button className='green-button' type='submit' disabled={isSubmitting}>Edit Proffile</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <Header />
      <div className='myproffile'>

        <div className='myproffile-cont'>
          <div className='myprofile-image'>
            <img src={user?.profPic ? user.profPic : '/default-profile-pic.jpg'} alt='Profile' className='profile-picture__image' />
          </div>
          <div className='myproffile-info'>
            <h1>{user?.username} <GrEdit onClick={() => setEditMode(true)} className='edit-icon' /></h1>
            <div className='myproffile-subinfo'>
              <div>
                <h4>{computeAge(user?.birthDate)} years old</h4>
                <h4>{user?.city}, {user.country}</h4>
              </div>

              <div className='desc-cont'>
                <h6>Description:</h6>
                <p>{user?.description ? user?.description : 'No description'}</p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <hr />
        <Tabs tabs={tabs} />
      </div>
    </>
  )
}

export default MyProffileScreen
