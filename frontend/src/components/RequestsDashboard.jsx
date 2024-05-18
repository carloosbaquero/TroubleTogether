import PropTypes from 'prop-types'
import RequestCard from './RequestCard'

const RequestsDashboard = ({ travelInfo }) => {
  const filteredRequests = travelInfo.requests.filter(value => !value.approved && !value.rejected)
  return (
    <>
      <h5>Requests con only be approved or rejected by the organizer</h5>
      <div className='destinations'>

        {filteredRequests.length > 0
          ? (
              filteredRequests.map((value, index) => (
                <RequestCard key={index} requestId={value._id} userId={value.user._id} username={value.user.username} profPic={value.user.profPic} travelId={travelInfo._id} />
              ))
            )
          : (
            <p>There are no requests yet.</p>
            )}
      </div>
    </>

  )
}

RequestsDashboard.propTypes = {
  travelInfo: PropTypes.object.isRequired
}

export default RequestsDashboard
