import {io} from "socket.io-client"

export const initialSocketConnection = () =>{
    const socket = io(import.meta.env.VITE_API_URL,{
        withCredentials: true,
    })

    socket.on('connect',()=>{
        console.log("Socket connected",socket.id)
    })

    socket.on('disconnect',()=>{
        console.log("Socket disconnected",socket.id)
    })

    return socket;
}