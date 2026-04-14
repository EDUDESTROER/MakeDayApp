import express from 'express';
import { requireAuth } from '../middlewares/auth/auth.middleware.js';
import { renderWorkSpace } from '../controllers/workspace.controller.js';

const router = express.Router();

router.get("/", requireAuth, renderWorkSpace);

export default router;