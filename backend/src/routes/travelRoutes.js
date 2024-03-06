import express from 'express'
import { createTravel, getTravelDashboard, getTravelInfo } from '../controllers/travelController.js'
import { isLogged } from '../middlewares/authMiddlewares.js'

const travelRoutes = express.Router()

travelRoutes.route('/travel')
  .post(isLogged, createTravel)

travelRoutes.route('/info/:id')
  .get(getTravelInfo)

travelRoutes.route('/dashboard/:id')
  .get(isLogged, getTravelDashboard)

export default travelRoutes
