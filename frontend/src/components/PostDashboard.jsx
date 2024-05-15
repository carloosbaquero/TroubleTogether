import { useState } from 'react'
import api from '../utils/api'
import { IoIosAddCircle } from 'react-icons/io'
import PropTypes from 'prop-types'
import Post from './Post'

const PostDashboard = ({ posts, travelId, handleReload, username, profPic, userId }) => {
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
      const { data } = await api.post(`/travels/dashboard/${travelId}/post`, input)

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

  return (
    <>
      <h2>Posts <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /> </h2>
      <br />
      {posts.length === 0 && !addMode && <h5>You can share new posts about your travel by clicking this button: <IoIosAddCircle onClick={() => setAddMode(true)} className='add-icon' /></h5>}
      <div className='destinations'>
        {addMode &&
          <Post handleReload={handleReload} travelId={travelId} user={{ username, profPic }} add setAddMode={setAddMode} />}
        {posts.map((value, index) => {
          return (
            <Post key={index} handleReload={handleReload} postId={value._id} travelId={travelId} user={{ userId, username, profPic }} imageUrl={value.image} description={value.description} postUser={value.user} />
          )
        })}
      </div>
    </>
  )
}

PostDashboard.propTypes = {
  handleReload: PropTypes.func,
  travelId: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired
}

export default PostDashboard