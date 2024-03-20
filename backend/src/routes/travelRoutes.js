import express from 'express'
import { addDestination, createTravel, deleteDestination, deleteTravel, getTravelDashboard, getTravelInfo, getTravels, updateDestination, updateTravel } from '../controllers/travelController.js'
import { isLogged, isOrganizer, isParticipant } from '../middlewares/authMiddlewares.js'

const travelRoutes = express.Router()

travelRoutes.route('/travel')
  .get(getTravels)
  .post(isLogged, createTravel)

travelRoutes.route('/info/:id')
  .get(getTravelInfo)

travelRoutes.route('/dashboard/:id')
  .get(isLogged, isParticipant, getTravelDashboard)
  .put(isLogged, isOrganizer, updateTravel)
  .delete(isLogged, isOrganizer, deleteTravel)

travelRoutes.route('/dashboard/:id/dest')
  .post(isLogged, isOrganizer, addDestination)

travelRoutes.route('/dashboard/:id/dest/:destId')
  .put(isLogged, isOrganizer, updateDestination)
  .delete(isLogged, isOrganizer, deleteDestination)

export default travelRoutes
