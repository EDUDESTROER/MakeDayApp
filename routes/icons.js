import express from 'express';
import { getIcons } from '../controllers/icons.controller.js';

const router = express.Router();

router.get("/", getIcons);

export default router;