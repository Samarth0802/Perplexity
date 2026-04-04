import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    participant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Auth',
        required:true,
    },
    title:{
        type:String,
        required:true,
    }
},{timestamps:true})

const chatModel = mongoose.model("Chat",chatSchema)
export default chatModel