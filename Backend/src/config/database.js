import mongoose  from "mongoose";
import dns from 'dns'
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

async function connectTODB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}

export default connectTODB