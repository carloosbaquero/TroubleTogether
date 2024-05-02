import express from 'express'
import { acceptRequest, createRequest, getTravelRequests, leaveTravel, rejectRequest } from '../controllers/requestController.js'
import { isLogged, isNotParticipant, isOrganizer, isParticipant, isTravelPlanningAndNotFull } from '../middlewares/authMiddlewares.js'

const requestRoutes = express.Router()

requestRoutes.route('/travel/:id/request')
  .post(isLogged, isNotParticipant, isTravelPlanningAndNotFull, createRequest)
  .get(isLogged, isOrganizer, getTravelRequests)

requestRoutes.route('/travel/:id/approve/:requestId')
  .post(isLogged, isOrganizer, isTravelPlanningAndNotFull, acceptRequest)

requestRoutes.route('/travel/:id/reject/:requestId')
  .post(isLogged, isOrganizer, isTravelPlanningAndNotFull, rejectRequest)

requestRoutes.route('/travel/:id/leave')
  .delete(isLogged, isParticipant, leaveTravel)

export default requestRoutes
