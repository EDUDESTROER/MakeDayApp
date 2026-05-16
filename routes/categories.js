import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { createCategory, getUserCategory } from "../controllers/categoiesController.js";
import { categoryLimiter } from '../middlewares/security/categoryLimiter.js';

const router = express.Router();

router.get("/", requireAuth, getUserCategory);

router.post("/", requireAuth, categoryLimiter, createCategory);

export default router;