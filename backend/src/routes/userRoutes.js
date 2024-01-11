import express from 'express'
import { register, login, getNewAccessToken, logout, updateProfile, completeProfile } from '../controllers/userController.js'
import { isLogged, roleCheck } from '../middlewares/authMiddlewares.js'

const userRoutes = express.Router()

userRoutes.route('/register')
  .post(register)

userRoutes.route('/login')
  .post(login)

userRoutes.route('/refresh')
  .post(getNewAccessToken)

userRoutes.route('/logout')
  .delete(logout)

userRoutes.route('/update')
  .put(isLogged, updateProfile)

userRoutes.route('/complete')
  .put(isLogged, completeProfile)

// Esto es para testear los middleware
userRoutes.get('/details', isLogged, roleCheck(['user']), (req, res) => {
  res.status(200).json({ message: 'user authenticated.' })
})

export default userRoutes
