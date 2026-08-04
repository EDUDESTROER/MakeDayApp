import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { changeFavorite } from "../controllers/notesController.js";

const router = express.Router();

router.patch("/", requireAuth, changeFavorite);

export default router;