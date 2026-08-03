import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { updateBackground } from "../controllers/notesController.js";
import upload from '../middlewares/upload.js';

const router = express.Router();

router.patch("/", requireAuth, upload.single('image'), updateBackground);

export default router;