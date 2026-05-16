import rateLimit, {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.js";

export const notesLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 600, // max of 600 attempts
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        prefix: "rl:notes",
        sendCommand: (...args)=> redisClient.sendCommand(args)
    }),

    keyGenerator: (req)=>{
        return req.session?.user.id || ipKeyGenerator(req); //Count the attempts of a user, up to a maximum of 600
    },
    handler: (req, res) =>{ // if pass 600 attempts this code is launch.

        console.warn(
            `🚨 Notes Rate limit hit - User: ${req.session?.user?.id} - Ip: ${req.ip}`
        );

        return res.status(429).json({
            gravity: 5,
            error: "Too many attempts. Please try again later."
        });

    }
});