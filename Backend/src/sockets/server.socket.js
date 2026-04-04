import { Server } from "socket.io";
import dotenv from 'dotenv'
dotenv.config();
let io;

export function initSocket(httpServer){
    io = new Server(httpServer, {
        cors: {
            origin: process.env.HOST_URL,
            methods: ["GET", "POST","PUT","DELETE"],
            credentials: true,
        }
    })
    console.log("Socket server initialized")
    io.on("connection",(socket) => {
        console.log("User connected",socket.id);

        socket.on("disconnect",() => {
            console.log("User disconnected",socket.id);
        })
    })
}

export function getIO(){
    if(!io){
        throw new Error("Socket is not initialized");
    }
    return io;
}