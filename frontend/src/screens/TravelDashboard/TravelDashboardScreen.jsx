import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import { useEffect, useState } from 'react'
import api from '../../utils/api'
import AtendeesList from '../../components/AtendeesList'
import parseDate from '../../utils/parseDate'
import Tabs from '../../components/Tabs'
import DestinationsDashboard from '../../components/DestinationsDashboard'
import { getAccessToken, getRefreshToken } from '../../utils/authHelpers'
import RequestsDashboard from '../../components/RequestsDashboard'
import Loader from '../../components/Loader'
import Modal from 'react-modal'
import { GrEdit } from 'react-icons/gr'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const TravelDashboard = () => {
  const [travelInfo, setTravelInfo] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editError, setEditError] = useState('')
  const [input, setInput] = useState({})
  const { travelId } = useParams()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const [shouldReload, setShouldReload] = useState(false)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date()
      .required('End Date is required')
      .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
    maxAtendees: Yup.number()
      .required('Max Atendees is required')
      .min(2, 'Must be at least 2')
      .max(30, 'Cannot exceed 30'),
    minAtendees: Yup.number()
      .required('Min Atendees is required')
      .min(2, 'Must be at least 2')
      .max(30, 'Cannot exceed 30')
  })

  const handleEdit = async (values, { setSubmitting }) => {
    try {
      const { data } = await api.put(`/travels/dashboard/${travelId}`, values)
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

  const handleReload = () => {
    setShouldReload(prevState => !prevState)
  }

  const handleLeave = async () => {
    try {
      const { data } = await api.delete(`/requests/travel/${travelId}/leave`)
      if (data.error === null) {
        setShowModal(false)
        handleReload()
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const getTravelInfo = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/travels/dashboard/${travelId}`)

        const resTravelInfo = data.data
        setTravelInfo(resTravelInfo)
        setInput({
          name: resTravelInfo.name,
          description: resTravelInfo.description,
          startDate: parseDate(resTravelInfo.startDate),
          endDate: parseDate(resTravelInfo.endDate),
          minAtendees: resTravelInfo.minAtendees,
          maxAtendees: resTravelInfo.maxAtendees
        })

        if (getAccessToken() && getRefreshToken()) {
          const { data } = await api.get('/users/whoami')
          setUserId(prevUserId => {
            if (!(data.data.userId === resTravelInfo.organizerId._id || resTravelInfo.atendees.some(atendee => atendee._id === data.data.userId))) {
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
        setShouldNavigate(true)
      }
    }

    getTravelInfo()
  }, [travelId, navigate, shouldReload])

  useEffect(() => {
    if (shouldNavigate) {
      navigate(`/globetrotters/travels/${travelId}/info`, { replace: true })
      setLoading(false)
    }
  }, [shouldNavigate, navigate, travelId])

  if (loading) {
    return (<Loader />)
  }

  const tabs = [
    { title: 'Destinations', content: <DestinationsDashboard handleReload={handleReload} organizer={travelInfo.organizerId._id === userId} travelInfo={travelInfo} /> },
    { title: 'Itinerary', content: <div>To implement 2</div> },
    { title: 'Suggestions', content: <div>To implement 3</div> },
    { title: 'Requests', content: <RequestsDashboard travelInfo={travelInfo} /> }
  ]
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
          <h3>Leave travel</h3>
          <br />
          <p>Do you want to leave this travel?</p>
          <br />
          <div className='modal-buttons'>
            <button className='red-button' onClick={() => setShowModal(false)}>Cancel</button>
            <button className='green-button' onClick={handleLeave}>Leave Travel</button>
          </div>
        </div>
      </Modal>

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
              <h1>Edit your trip planning</h1>
              <div>
                <label htmlFor='travelName'>Name:</label>
                <Field type='text' id='travelName' name='name' />
                <ErrorMessage name='name' component='div' className='error' />

                <label htmlFor='travelDesc'>Description:</label>
                <Field as='textarea' id='travelDesc' name='description' />
                <ErrorMessage name='description' component='div' className='error' />

                <div className='form-group'>
                  <div>
                    <label htmlFor='startDate'>Start Date:</label>
                    <Field type='date' id='startDate' name='startDate' />
                    <ErrorMessage name='startDate' component='div' className='error' />
                  </div>
                  <div>
                    <label htmlFor='endDate'>End Date:</label>
                    <Field type='date' id='endDate' name='endDate' />
                    <ErrorMessage name='endDate' component='div' className='error' />
                  </div>

                  <div>
                    <label htmlFor='maxAtendees'>Max. Atendees:</label>
                    <Field type='number' min={2} max={30} id='maxAtendees' name='maxAtendees' />
                    <ErrorMessage name='maxAtendees' component='div' className='error' />
                  </div>
                  <div>
                    <label htmlFor='minAtendees'>Min. Atendees:</label>
                    <Field type='number' min={2} max={30} id='minAtendees' name='minAtendees' />
                    <ErrorMessage name='minAtendees' component='div' className='error' />
                  </div>

                </div>
              </div>
              <p className='error-message'>{editError}</p>
              <br />
              <div className='modal-buttons'>
                <button className='red-button' onClick={() => setEditMode(false)}>Cancel</button>
                <button className='green-button' type='submit' disabled={isSubmitting}>Edit Travel</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <Header />
      <div className='travels'>

        <h1>{travelInfo.name} {travelInfo.organizerId._id === userId ? <GrEdit onClick={() => setEditMode(true)} className='edit-icon' /> : ''}</h1>
        <hr />
        <div className='travel-info'>

          <div className='info'>

            <h3>Description:</h3>
            <h3>{travelInfo.description}</h3>
            <br />
            <h5>Start: {parseDate(travelInfo.startDate)}</h5>
            <h5>End: {parseDate(travelInfo.endDate)}</h5>
            <br />
            <hr />
            <Tabs tabs={tabs} />

          </div>
          <div className='atendees'>
            <AtendeesList organizer={travelInfo.organizerId} maxAtendees={travelInfo.maxAtendees} minAtendees={travelInfo.minAtendees} atendees={travelInfo.atendees} />
            {travelInfo && travelInfo.atendees.some(atendee => atendee._id === userId) && <button className='red-button' onClick={() => setShowModal(true)}>Leave travel</button>}
          </div>
        </div>
      </div>
    </>
  )
}

export default TravelDashboard
