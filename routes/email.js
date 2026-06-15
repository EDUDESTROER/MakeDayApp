import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { changeEmail } from "../controllers/userController.js"
import { emailLimiter } from "../middlewares/security/emailLimiter.js";
const router = express.Router();

router.post("/", requireAuth, emailLimiter, changeEmail);

export default router;