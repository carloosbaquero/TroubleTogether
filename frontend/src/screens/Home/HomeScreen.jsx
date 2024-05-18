import Header from '../../components/Header'
import './Home.css'

const HomeScreen = () => {
  return (
    <>
      <Header />
      <div className='home'>
        <div className='home-info'>
          <img src='/big-logo.svg' alt='whole-logo' />
          <div className='home-text'>
            <h4>Globetrotters </h4>
            <p>is the website where you can find your dreamt travel. We want to create a big community of travellers who can share their favourites destinations so they can find someone to start planning the trip. </p>
            <br />
            <p>You will be able to create a travel or to join an already created one, so you can start planning it with more travellers around the world.</p>
            <br />
            <p>Moreover, once you have planned your trip, you will have the option of sharing posts with the rest of the users in the community.</p>
            <br />
            <p>You can start by <a href='/globetrotters/travels'>Searching for a travel</a> or by <a href='/globetrotters/create-travel'> Planning a travel by yourself</a> .</p>
          </div>
        </div>

      </div>
    </>

  )
}

export default HomeScreen
