import express from 'express'
import { createTravel, getTravelDashboard, getTravelInfo, getTravels, updateTravel } from '../controllers/travelController.js'
import { isLogged } from '../middlewares/authMiddlewares.js'

const travelRoutes = express.Router()

travelRoutes.route('/travel')
  .get(getTravels)
  .post(isLogged, createTravel)

travelRoutes.route('/info/:id')
  .get(getTravelInfo)

travelRoutes.route('/dashboard/:id')
  .get(isLogged, getTravelDashboard)
  .put(isLogged, updateTravel)

export default travelRoutes
