import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { updateName } from "../controllers/notesController.js";

const router = express.Router();

router.patch("/", requireAuth, updateName);

export default router;