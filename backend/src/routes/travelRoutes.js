import express from 'express'
import { addDailyItinerary, addDestination, addSuggestion, changeState, createTravel, deleteDailyItinerary, deleteDestination, deleteSuggestion, deleteTravel, dislikeSuggestion, getTravelDashboard, getTravelInfo, getTravels, likeSuggestion, updateDailyItinerary, updateDestination, updateSuggestion, updateTravel } from '../controllers/travelController.js'
import { isLogged, isOrganizer, isParticipant } from '../middlewares/authMiddlewares.js'
import { uploadPost } from '../utils/upload.js'
import { addComment, addPost, deleteComment, deletePost, getAllPosts, likePost } from '../controllers/postController.js'

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

travelRoutes.route('/dashboard/:id/post')
  .post(isLogged, isParticipant, uploadPost.single('image'), addPost)

travelRoutes.route('/dashboard/:id/post/:postId')
  .delete(isLogged, deletePost)
  .post(isLogged, likePost)

travelRoutes.route('/dashboard/:id/post/:postId/comment')
  .post(isLogged, addComment)

travelRoutes.route('/dashboard/:id/post/:postId/comment/:comId')
  .delete(isLogged, deleteComment)

travelRoutes.route('/posts')
  .get(getAllPosts)

export default travelRoutes
