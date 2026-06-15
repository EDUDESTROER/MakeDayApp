import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { changeAvatar } from "../controllers/userController.js"
import { handleAvatarUpload } from "../middlewares/handle.avatar.upload.js";
import { avatarLimiter } from "../middlewares/security/avatarLimiter.js";
const router = express.Router();

router.post("/", requireAuth, avatarLimiter, handleAvatarUpload, changeAvatar);

export default router;