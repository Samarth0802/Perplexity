import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    }
})


transporter.verify(async(err,success)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Mail server is ready")
    }
})

const sendMail = async({to,subject,text,html})=>{
    try {
        await transporter.sendMail({
            from:process.env.GMAIL_USER,
            to,
            subject,
            html
        })
    } catch (error) {
        console.log(error)
    }
}

export default sendMail