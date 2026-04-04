import jwt from 'jsonwebtoken'
import redis from '../config/cache.js'

async function authMiddleware(req,res,next){
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized"})
        }

        const isTokenBlackListed = await redis.get(token)
        if(isTokenBlackListed){
            return res.status(401).json({success:false,message:"Unauthorized"})
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export default authMiddleware