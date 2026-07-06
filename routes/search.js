import express from 'express';
import { requireAuth } from '../middlewares/auth/auth.middleware.js';
import { searchTerm } from '../controllers/search.controller.js';

const router = express.Router();

router.get("/", requireAuth, searchTerm);

export default router;