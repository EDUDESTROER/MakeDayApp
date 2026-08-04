import slowDown from "express-slow-down";
import {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.js";

export const changeNoteSlowDown = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // After 50 attemps
    delayMs: (hits) => (hits - 50) * 200, // Increase 200ms for attempts
    keyGenerator: (req)=>{
        return req.session?.user.id || ipKeyGenerator(req)
    },
    store: new RedisStore({
        prefix: "sd:change-note",
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
});