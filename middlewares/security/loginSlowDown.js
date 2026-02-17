import slowDown from "express-slow-down";

export const loginSlowDown = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 3, // After 3 attemps
    delayMs: (hits) => hits * 500 // Increase 500ms for attempts
});