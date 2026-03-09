import rateLimit, {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.js";

export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max of 10 attempts
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        prefix: "rl:register",
        sendCommand: (...args)=> redisClient.sendCommand(args)
    }),

    keyGenerator: (req)=> ipKeyGenerator(req), //Count the attempts of a ip, up to a maximum of 10
    handler: (req, res) =>{ // if pass 5 attempts this code is launch.

        console.warn(
            `🚨 Register Rate limit hit - IP: ${req.ip} - UA: ${req.get('user-agent')}`
        );

        return res.status(429).json({
            gravity: 5,
            error: "Too many registration attempts attempts. Please try again later."
        });

    }
});