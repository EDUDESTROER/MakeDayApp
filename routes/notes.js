import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import upload from '../middlewares/upload.js';
import { createNote, getUserNote, updateNote} from "../controllers/notesController.js";
import { notesLimiter } from '../middlewares/security/notesLimiter.js';
import newNoteRouter from './new-name.js';
import newIconRouter from './new-icon.js';
import newBackgroundRouter from './new-background.js';

const router = express.Router();

router.get("/", requireAuth, getUserNote);

router.post("/", requireAuth, notesLimiter, upload.single('image'), createNote);

router.put("/", requireAuth, notesLimiter, updateNote);

router.use('/new-name', newNoteRouter);
router.use('/new-icon', newIconRouter);
router.use('/new-background', newBackgroundRouter);

// when delete a note be more restricted with limiter!

export default router;