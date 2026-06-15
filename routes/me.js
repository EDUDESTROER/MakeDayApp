import express from "express";
import { requireAuth } from "../middlewares/auth/auth.middleware.js";
import { getUserInfo } from "../controllers/userController.js"
import deleteRouter from './deleteUser.js';
import emailRouter from './email.js';
import nameRouter from './name.js';
import nicknameRouter from './nickname.js';
import avatarRouter from './avatar.js';

const router = express.Router();

router.get("/", requireAuth, getUserInfo);

router.use('/delete', deleteRouter);
router.use('/email', emailRouter);
router.use('/name', nameRouter);
router.use('/nickname', nicknameRouter);
router.use('/avatar', avatarRouter);

export default router;