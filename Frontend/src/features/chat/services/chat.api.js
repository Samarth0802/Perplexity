import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export const sendMessage = async (message,chatId) => {
    const response = await api.post('/api/chat/message',{message,chatId})
    return response.data
}

export const getChats = async () => {
    const response = await api.get('/api/chat/getChats')
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chat/getMessages/${chatId}`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chat/deleteChat/${chatId}`)
    return response.data
}