import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { getUserAchievements } from "../controllers/achievementsController.js";

const router = express.Router();

router.get("/", requireAuth, getUserAchievements);

export default router;