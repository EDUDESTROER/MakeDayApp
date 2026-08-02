import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { updateIcon } from "../controllers/notesController.js";

const router = express.Router();

router.patch("/", requireAuth, updateIcon);

export default router;