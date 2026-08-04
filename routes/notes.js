import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import upload from '../middlewares/upload.js';
import { createNote, getUserNote, updateNote, deleteNote} from "../controllers/notesController.js";
import { notesLimiter } from '../middlewares/security/notesLimiter.js';
import { notesDeleteLimiter } from "../middlewares/security/notesDeleteLimiter.js";
import newNoteRouter from './new-name.js';
import newIconRouter from './new-icon.js';
import newBackgroundRouter from './new-background.js';
import favoritesRouter from './favorites.js';

const router = express.Router();

router.get("/", requireAuth, getUserNote);

router.post("/", requireAuth, notesLimiter, upload.single('image'), createNote);

router.put("/", requireAuth, notesLimiter, updateNote);

router.delete("/", requireAuth, notesDeleteLimiter, deleteNote);

router.use('/new-name', newNoteRouter);
router.use('/new-icon', newIconRouter);
router.use('/new-background', newBackgroundRouter);
router.use('/favorites', favoritesRouter);

// when delete a note be more restricted with limiter!

export default router;