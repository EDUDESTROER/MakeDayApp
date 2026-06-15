import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { changeNickname } from "../controllers/userController.js"
import { nicknameLimiter } from "../middlewares/security/nicknameLimiter.js";

const router = express.Router();

router.post("/", requireAuth, nicknameLimiter, changeNickname);

export default router;