import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { changeName } from "../controllers/userController.js"
import { nameLimiter } from "../middlewares/security/nameLimiter.js";

const router = express.Router();

router.post("/", requireAuth, nameLimiter, changeName);

export default router;