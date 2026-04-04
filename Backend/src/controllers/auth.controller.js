import authModel from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../services/mail.service.js";
import redis from "../config/cache.js";

// ================= REGISTER USER =================
async function registerUser(req, res, next) {
    try {
        const { username, email, password } = req.body;

        // 🔹 Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔹 Check existing user
        const existingUser = await authModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 🔹 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // 🔹 Create user FIRST
        const newUser = await authModel.create({
            username,
            email,
            password: hashedPassword,
            otp: hashedOtp,
            otpExpiry: Date.now() + 60 * 60 * 1000 // 1 hour
        });

        // 🔹 Generate token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 🔹 Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // ⚠️ make true in production (HTTPS)
            maxAge: 60 * 60 * 1000
        });

        // 🔹 Send Email AFTER user creation
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;"> <h2 style="color: #333; text-align: center;">Welcome to Perplexity Clone, ${username}!</h2> <p style="font-size: 16px; color: #555;">To complete your registration, please use the following One-Time Password (OTP):</p> <div style="text-align: center; margin: 30px 0;"> <span style="font-size: 32px; font-weight: bold; color: #007BFF; letter-spacing: 5px; background: #f0f8ff; padding: 10px 20px; border-radius: 5px; border: 1px dashed #007BFF;">${otp}</span> </div> <p style="font-size: 14px; color: #777;">This OTP is valid for 1 hour. If you didn't request this, please ignore this email.</p> <hr style="border: none; border-top: 1px solid #eee;"> <p style="font-size: 12px; color: #999; text-align: center;">© 2026 Perplexity Clone Team</p> </div>
        `

        await sendMail({
            to: email,
            subject: "Verify Your Email",
            html
        });

        // 🔹 Response
        res.status(201).json({
            message: "User registered successfully. OTP sent to email.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                verified: newUser.verified
            }
        });

    } catch (error) {
        error.status = 500;
        next(error);
    }
}

// ================= VERIFY EMAIL =================
async function verifyEmail(req, res, next) {
    try {
        const { otp } = req.body;
        const token = req.cookies.token;

        if (!otp || !token) {
            return res.status(400).json({ message: "OTP and token required" });
        }

        // 🔹 Verify token safely
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // 🔹 Find user
        const user = await authModel.findById(decoded.id).select("+otp +otpExpiry");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🔹 Check OTP expiry
        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // 🔹 Compare OTP
        const isMatch = await bcrypt.compare(otp, user.otp);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // 🔹 Mark verified
        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        // 🔹 Clear cookie
        res.clearCookie("token");

        res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {
        error.status = 500;
        next(error);
    }
}

async function loginUser(req,res,next){
    try {
        const {identifier,password} = req.body

        if(!identifier || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        let user;
        if(identifier.includes('@')){
            user = await authModel.findOne({email:identifier}).select("+password")
        }else{
            user = await authModel.findOne({username:identifier}).select("+password")
        }
        if(!identifier || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})

        res.cookie("token",token,{httpOnly:true,secure:false,maxAge:7*24*60*60*1000})

        res.status(200).json({
            message:"User logged in successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                verified:user.verified
            }
        })
    } catch (error) {
        error.status = 500;
        next(error);
    }
}

async function getUser(req,res,next){
    try {

        if(!req.user){
            return res.status(401).json({message:"Unauthorized"})
        }

        const user = await authModel.findById(req.user.id)

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        res.status(200).json({
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                verified:user.verified
            }
        })
    } catch (error) {
        error.status = 500;
        next(error);
    }
}


async function logoutUser(req,res,next){
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        await redis.set(token, 'blacklisted', 'EX', 7*24*60*60*1000)
        res.clearCookie("token")

        res.status(200).json({
            message:"User logged out successfully"
        })
    } catch (error) {
        error.status = 500;
        next(error);
    }
}

export { registerUser, verifyEmail,loginUser,getUser,logoutUser};