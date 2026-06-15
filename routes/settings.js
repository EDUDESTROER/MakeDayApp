import express from 'express';
import { requireAuth } from '../middlewares/auth/auth.middleware.js';
import { getSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.get("/", requireAuth, getSettings);

export default router;