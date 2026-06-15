import rateLimit, {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.js";

export const deleteUserLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, // max of 3 attempts
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        prefix: "rl:deleteUser",
        sendCommand: (...args)=> redisClient.sendCommand(args)
    }),

    keyGenerator: (req)=>{
        return req.session?.user?.id || ipKeyGenerator(req); //Count the attempts of a user, up to a maximum of 3
    },
    handler: (req, res) =>{ // if pass 3 attempts this code is launch.

        console.warn(
            `🚨 delete User Rate limit hit - User: ${req.session?.user.id} - Ip: ${req.ip}`
        );

        return res.status(429).json({
            gravity: 5,
            error: "Too many attempts. Please try again tomorrow."
        });

    }
});