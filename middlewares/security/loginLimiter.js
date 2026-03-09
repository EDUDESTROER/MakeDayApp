import rateLimit, {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.js";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // max of 5 attempts
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        prefix: "rl:login",
        sendCommand: (...args)=> redisClient.sendCommand(args)
    }),

    keyGenerator: (req)=>{
        const email = req.body?.email || 'unknown';
        return `${ipKeyGenerator(req)}-${email}`; //Count the attempts of a email/ip, up to a maximum of 5
    },
    handler: (req, res) =>{ // if pass 5 attempts this code is launch.

        console.warn(
            `🚨 Rate limit hit - IP: ${req.ip} - Email: ${req.body.email}`
        );

        return res.status(429).json({
            gravity: 5,
            error: "Too many login attempts. Please try again later."
        });

    }
});