import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { getDashboardHome } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", requireAuth, getDashboardHome);

export default router;