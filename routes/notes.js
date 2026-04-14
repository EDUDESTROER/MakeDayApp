import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import upload from '../middlewares/upload.js';
import { createNote } from "../controllers/notesController.js";

const router = express.Router();

router.post("/", requireAuth, upload.single('image'), createNote);

export default router;