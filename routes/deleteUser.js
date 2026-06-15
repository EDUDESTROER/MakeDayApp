import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { deleteUser } from "../controllers/userController.js";
import { deleteUserLimiter } from "../middlewares/security/deleteUserLimiter.js";

const router = express.Router();

router.post("/", requireAuth, deleteUserLimiter, deleteUser);

export default router;