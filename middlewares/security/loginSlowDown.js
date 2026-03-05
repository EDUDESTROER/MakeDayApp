import slowDown from "express-slow-down";
import {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../configs/redis.js";

export const loginSlowDown = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 3, // After 3 attemps
    delayMs: (hits) => hits * 500, // Increase 500ms for attempts
    keyGenerator: (req)=>{
        const email = req.body?.email || 'unknown';
        return `${ipKeyGenerator(req)}-${email}`; //Count the attempts of a email/ip, up to a maximum of 5
    },
    store: new RedisStore({
        prefix: "sd:login",
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
});