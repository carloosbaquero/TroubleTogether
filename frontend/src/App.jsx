import { Route, Routes, Navigate } from 'react-router-dom'
import SignUpScreen from './screens/SignUp/SignUpScreen'
import HomeScreen from './screens/Home/HomeScreen'
import CreateTravel from './screens/CreateTravel/CreateTravel'
import { initAxiosAuth } from './utils/authHelpers'
import TravelScreen from './screens/Travels/TravelsScreen'
import TravelInfoScreen from './screens/TravelInfo/TravelInfoScreen'
import TravelDashboard from './screens/TravelDashboard/TravelDashboardScreen'
import MyProffileScreen from './screens/Proffile/MyProffileScreen'
import CommunityScreen from './screens/Community/CommunityScreen'
import ProffileScreen from './screens/Proffile/ProffileScreen'

initAxiosAuth()

function App () {
  return (
    <Routes>
      <Route path='/globetrotters/sign' element={<SignUpScreen />} />
      <Route path='/globetrotters' element={<HomeScreen />} />
      <Route path='/globetrotters/travels' element={<TravelScreen />} />
      <Route path='/globetrotters/community' element={<CommunityScreen />} />
      <Route path='/globetrotters/create-travel' element={<CreateTravel />} />
      <Route path='/globetrotters/travels/:travelId/info' element={<TravelInfoScreen />} />
      <Route path='/globetrotters/travels/:travelId/dashboard' element={<TravelDashboard />} />
      <Route path='/globetrotters/my-proffile' element={<MyProffileScreen />} />
      <Route path='/globetrotters/proffile/:userId' element={<ProffileScreen />} />
      <Route path='*' element={<Navigate to='/globetrotters' />} />
    </Routes>
  )
}

export default App
