import app from "./src/app.js";
import dotenv from 'dotenv'
import connectTODB from "./src/config/database.js";
dotenv.config()
import { initSocket } from "./src/sockets/server.socket.js";
import http from 'http'

const port = process.env.PORT || 5000
connectTODB()

const httpServer = http.createServer(app)

initSocket(httpServer)

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})