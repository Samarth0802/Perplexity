import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import errorMiddleware from './middlewares/error.middleware.js'
import authRouter from './routes/app.routes.js'
import chatRouter from './routes/chat.routes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express();
app.use(express.json())

app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.HOST_URL,
    credentials: true
}))

app.use(morgan('dev'))
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/chat',chatRouter)

// Serve Frontend
const frontendPath = path.join(__dirname, '../../Frontend/dist')
app.use(express.static(frontendPath))

app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'))
})

app.use(errorMiddleware)
export default app