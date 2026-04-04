import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateReponse, generateTitle } from "../services/ai.service.js";


async function chatMessage(req,res,next){
    try {
        let {message,chatId} = req.body
        const userId = req.user.id
        console.log("📨 Received Message:", message, "from User:", userId);
        
        let title = "New Thread";
        try {
            title = await generateTitle(message)
            console.log("📝 Generated Title:", title);
        } catch (titleError) {
            console.error("⚠️ Title Generation Failed, using default:", titleError.message);
        }
        

        let chat;
        if(!chatId){
            chat = await chatModel.create({
                participant:userId,
                title:title
            })
            chatId = chat._id
        } else {
            chat = await chatModel.findById(chatId)
        }

        const humanResponse = await messageModel.create({
            chat:chatId,
            role:'user',
            content:message
        })
        console.log("💾 Created User Message in DB");
        const messages = await messageModel.find({chat:chatId})
        console.log("🤖 Generating AI Response for", messages.length, "messages...");
        const response = await generateReponse(messages)
        console.log("✅ AI Response Generated");

        const aiResponse = await messageModel.create({
            chat:chatId,
            role:'assistant',
            content:response
        })

        res.status(200).json({
            success:true,
            message:'Message sent successfully',
            data:{
                chat,
                humanResponse,
                aiResponse
            }
        })
    } catch (error) {
     error.message = error.message || "Internal server error"
     next(error)   
    }
}

async function getChats(req,res,next){
    try {
        const userId = req.user.id
        const chats = await chatModel.find({participant:userId})
        res.status(200).json({
            success:true,
            message:'Chats fetched successfully',
            data:chats
        })
    } catch (error) {
     error.message = error.message || "Internal server error"
     next(error)   
    }
}

async function getMessages(req,res,next){
    try {
        const {chatId} = req.params
        const messages = await messageModel.find({chat:chatId})
        res.status(200).json({
            success:true,
            message:'Messages fetched successfully',
            data:messages
        })
    } catch (error) {
     error.message = error.message || "Internal server error"
     next(error)   
    }
}

async function deleteChat(req,res,next){
    try {
        const {chatId} = req.params
        const chat = await chatModel.findByIdAndDelete(chatId)
        await messageModel.deleteMany({chat:chatId})
        res.status(200).json({
            success:true,
            message:'Chat and it\'s messages deleted successfully',
            data:chat
        })
    } catch (error) {
     error.message = error.message || "Internal server error"
     next(error)   
    }
}

export {chatMessage,getChats,getMessages,deleteChat}