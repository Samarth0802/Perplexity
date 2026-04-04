import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    verified:{
        type:Boolean,
        default:false
    },  
    otp:{
        type:String,
        select:false
    },
    otpExpiry:{
        type:Date,
        select:false
    }
},{timestamps:true})

const authModel = mongoose.model("Auth",authSchema)
export default authModel
