import express from 'express';
import { requireAuth } from '../middlewares/auth/auth.middleware.js';

const router = express.Router();

router.get("/", requireAuth, function(req, res, next){

    res.status(200).render('workspace-page');

});

export default router;