import rateLimit, {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.js";

export const nameLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5, // max of 5 attempts
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        prefix: "rl:changeName",
        sendCommand: (...args)=> redisClient.sendCommand(args)
    }),

    keyGenerator: (req)=>{
        return req.session?.user?.id || ipKeyGenerator(req); //Count the attempts of a user, up to a maximum of 5
    },
    handler: (req, res) =>{ // if pass 5 attempts this code is launch.

        console.warn(
            `🚨 Name Rate limit hit - User: ${req.session?.user.id} - Ip: ${req.ip}`
        );

        return res.status(429).json({
            gravity: 5,
            error: "Too many attempts. Please try again tomorrow."
        });

    }
});