import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import Header from '../../components/Header'
import './CreateTravel.css'
import api from '../../utils/api'
import countries from '../../utils/countries'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CreateTravel = () => {
  const [error, setError] = useState()
  const navigate = useNavigate()

  const initialValues = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxAtendees: '',
    minAtendees: '',
    destinations: [{ city: '', country: 'Afghanistan', startDest: '', endDest: '' }]
  }

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
      .max(30, 'Cannot exceed 30'),
    destinations: Yup.array().of(
      Yup.object().shape({
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        startDest: Yup.date().required('Start Date for Destination is required'),
        endDest: Yup.date()
          .required('End Date for Destination is required')
          .min(Yup.ref('startDest'), 'End Date for Destination must be after Start Date for Destination')
      })
    )
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    await api.post('/travels/travel', values)
      .then(response => {
        if (response.data.error === null) {
          const travelId = response.data.data._id
          navigate(`/globetrotters/travels/${travelId}/dashboard`)
        }
      })
      .catch(err => {
        console.log(err)
        setError(err.response.data.error)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <div>
      <Header />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className='create-travel'>
            <h1>Let's start planning your trip</h1>
            <p>(If your travel's start date is three years from now, it will not appear in the Search for a Travel feed unless you use the correct dates filters.)</p>
            <br />
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

              <label>Destinations:</label>
              <FieldArray
                name='destinations'
                render={(arrayHelpers) => (
                  <div>
                    {values.destinations.map((destination, index) => (
                      <div className='destination' key={index}>

                        <div className='form-group'>
                          <div>
                            <label className='sub-label'>City:</label>
                            <Field
                              type='text'
                              name={`destinations[${index}].city`}
                              placeholder='City'
                            />
                            <ErrorMessage name={`destinations[${index}].city`} component='div' className='error' />
                          </div>

                          <div>
                            <label className='sub-label'>Country:</label>
                            <Field
                              as='select'
                              name={`destinations[${index}].country`}
                              placeholder='Country'
                            >
                              {countries.map((value, index) => { return (<option key={index} value={value}>{value}</option>) })}
                            </Field>
                            <ErrorMessage name={`destinations[${index}].country`} component='div' className='error' />
                          </div>

                        </div>

                        <div className='form-group'>
                          <div>
                            <label className='sub-label'>Start Date:</label>
                            <Field
                              type='date'
                              name={`destinations[${index}].startDest`}
                            />
                            <ErrorMessage name={`destinations[${index}].startDest`} component='div' className='error' />
                          </div>
                          <div>
                            <label className='sub-label'>End Date:</label>
                            <Field
                              type='date'
                              name={`destinations[${index}].endDest`}
                            />
                            <ErrorMessage name={`destinations[${index}].endDest`} component='div' className='error' />

                          </div>
                        </div>

                        <button
                          className='red-button'
                          type='button'
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={values.destinations.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className='green-button' type='button' onClick={() => arrayHelpers.push({ city: '', country: 'Afghanistan', startDest: '', endDest: '' })}>
                      Add Destination
                    </button>
                  </div>
                )}
              />
            </div>
            <br />
            <div style={{ maxWidth: '800px' }}>
              <p className='error-message'>{error}</p>
            </div>

            <button className='green-button' type='submit' disabled={isSubmitting}>
              Submit
            </button>

          </Form>
        )}

      </Formik>
    </div>
  )
}

export default CreateTravel
