import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { chatMessage,getChats,getMessages,deleteChat } from '../controllers/chat.controller.js'
const chatRouter = express.Router()

chatRouter.post('/message',authMiddleware,chatMessage)
chatRouter.get("/getChats",authMiddleware,getChats)
chatRouter.get('/getMessages/:chatId',authMiddleware,getMessages)
chatRouter.delete('/deleteChat/:chatId',authMiddleware,deleteChat)

export default chatRouter
