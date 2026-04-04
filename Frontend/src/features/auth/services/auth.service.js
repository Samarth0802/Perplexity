import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export const registerUser = async (username,email,password) => {
    const response = await api.post('/api/auth/register', {username,email,password})
    return response.data
}

export const verifyEmail = async (otp) => {
    const response = await api.post('/api/auth/verify-email', otp)
    return response.data
}

export const loginUser = async (identifier,password) => {
    const response = await api.post('/api/auth/login', {identifier,password})
    return response.data
}

export const getUser = async () => {
    const response = await api.get('/api/auth/user')
    return response.data
}

export const logoutUser = async () => {
    const response = await api.post('/api/auth/logout')
    return response.data
}