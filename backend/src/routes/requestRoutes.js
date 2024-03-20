import express from 'express'
import { acceptRequest, createRequest, getTravelRequests, rejectRequest } from '../controllers/requestController'
import { isLogged, isNotParticipant, isOrganizer, isTravelPlanningAndNotFull } from '../middlewares/authMiddlewares'

const requestRoutes = express.Router()

requestRoutes.route('/travel/:id/request')
  .post(isLogged, isNotParticipant, isTravelPlanningAndNotFull, createRequest)
  .get(isLogged, isOrganizer, getTravelRequests)

requestRoutes.route('/travel/:id/approve/:requestId')
  .post(isLogged, isOrganizer, isTravelPlanningAndNotFull, acceptRequest)

requestRoutes.route('/travel/:id/reject/:requestId')
  .post(isLogged, isOrganizer, isTravelPlanningAndNotFull, rejectRequest)

export default requestRoutes
