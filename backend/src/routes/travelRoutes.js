import express from 'express'
import { addDailyItinerary, addDestination, addSuggestion, changeState, createTravel, deleteDailyItinerary, deleteDestination, deleteSuggestion, deleteTravel, dislikeSuggestion, getTravelDashboard, getTravelInfo, getTravels, likeSuggestion, updateDailyItinerary, updateDestination, updateSuggestion, updateTravel } from '../controllers/travelController.js'
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

travelRoutes.route('/dashboard/:id/state')
  .post(isLogged, isOrganizer, changeState)

travelRoutes.route('/dashboard/:id/dest')
  .post(isLogged, isOrganizer, addDestination)

travelRoutes.route('/dashboard/:id/dest/:destId')
  .put(isLogged, isOrganizer, updateDestination)
  .delete(isLogged, isOrganizer, deleteDestination)

travelRoutes.route('/dashboard/:id/itinerary')
  .post(isLogged, isOrganizer, addDailyItinerary)

travelRoutes.route('/dashboard/:id/itinerary/:itId')
  .put(isLogged, isOrganizer, updateDailyItinerary)
  .delete(isLogged, isOrganizer, deleteDailyItinerary)

travelRoutes.route('/dashboard/:id/suggestion')
  .post(isLogged, isParticipant, addSuggestion)

travelRoutes.route('/dashboard/:id/suggestion/:sugId')
  .put(isLogged, isParticipant, updateSuggestion)
  .delete(isLogged, isParticipant, deleteSuggestion)

travelRoutes.route('/dashboard/:id/suggestion/:sugId/like')
  .post(isLogged, isParticipant, likeSuggestion)

travelRoutes.route('/dashboard/:id/suggestion/:sugId/dislike')
  .post(isLogged, isParticipant, dislikeSuggestion)

export default travelRoutes
