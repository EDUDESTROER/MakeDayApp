import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { createCategory } from "../controllers/categoiesController.js";

const router = express.Router();

router.post("/", requireAuth, createCategory);

export default router;