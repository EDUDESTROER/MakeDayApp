import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { updateIcon } from "../controllers/notesController.js";
import { changeNoteLimiter } from "../middlewares/security/changeNoteLimiter.js";
import { changeNoteSlowDown } from '../middlewares/security/changeNoteSlowDown.js';

const router = express.Router();

router.patch("/", requireAuth, changeNoteSlowDown, changeNoteLimiter, updateIcon);

export default router;