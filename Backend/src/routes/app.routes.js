import express from 'express'
import { registerUser,verifyEmail,loginUser,getUser,logoutUser} from '../controllers/auth.controller.js'
import { registerValidator, loginValidator, verifyValidator } from '../validators/auth.validator.js'
import authMiddleware from '../middlewares/auth.middleware.js'


const authRouter = express.Router()

authRouter.post('/register', registerValidator, registerUser)
authRouter.post('/verify-email', verifyValidator, verifyEmail)
authRouter.post('/login', loginValidator, loginUser)
authRouter.get('/user',authMiddleware,getUser)
authRouter.post('/logout',authMiddleware,logoutUser)

export default authRouter
