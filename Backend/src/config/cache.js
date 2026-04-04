import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null
})

redis.on('connect', () => {
    console.log("Connected to Redis")
})

redis.on('error', (error) => {
    console.error("Redis Error:", error)
})

export default redis