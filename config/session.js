import session from "express-session";
import { RedisStore } from "connect-redis";
import { redisClient } from "./redis.js";

export const sessionMiddleware = session({
    store: new RedisStore({
        client: redisClient,
        prefix: 'sess: '
    }),
    secret: process.env.SESSION_SECRET || 'Crismon-top-um-br',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // True if HTTPS
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }

});