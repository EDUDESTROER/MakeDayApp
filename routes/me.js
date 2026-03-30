import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { getUserInfo } from "../controllers/userController.js"

const router = express.Router();

router.get("/", requireAuth, getUserInfo);

export default router;