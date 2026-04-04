import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats:[],
        currentChat:null,
        messages:[],
        loading:false,
        error:null
    },
    reducers:{
        setChats:(state,action) => {
            state.chats = action.payload
        },
        setCurrentChat:(state,action) => {
            state.currentChat = action.payload
        },
        setMessages:(state,action) => {
            state.messages = action.payload
        },
        setLoading:(state,action) => {
            state.loading = action.payload
        },
        setError:(state,action) => {
            state.error = action.payload
        }
    }
})

export const {setChats,setCurrentChat,setMessages,setLoading,setError} = chatSlice.actions
export default chatSlice.reducer