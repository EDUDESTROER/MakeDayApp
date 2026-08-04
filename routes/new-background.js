import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { updateBackground } from "../controllers/notesController.js";
import { changeNoteLimiter } from "../middlewares/security/changeNoteLimiter.js";
import { changeNoteSlowDown } from '../middlewares/security/changeNoteSlowDown.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.patch("/", requireAuth, changeNoteSlowDown, changeNoteLimiter, upload.single('image'), updateBackground);

export default router;