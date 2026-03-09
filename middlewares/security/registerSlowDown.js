import slowDown from "express-slow-down";
import {ipKeyGenerator} from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.js";

export const registerSlowDown = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 6,
    delayMs: (hits) => Math.min(hits * 300, 5000),
    keyGenerator: (req) => ipKeyGenerator(req),
    store: new RedisStore({
        prefix: "sd:register",
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
});