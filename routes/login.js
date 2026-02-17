import express from 'express';
import { login } from '../controllers/loginController.js';
import { loginLimiter } from '../middlewares/security/loginLimiter.js';
import { loginSlowDown } from '../middlewares/security/loginSlowDown.js';
const router = express.Router();


router.get("/", function(req, res, next){

    res.status(200).render('login',{
      title: "MakeDay - Welcome Back!",
      aling: '0',
      skewySide: 'skewX(-1deg)',
      background: "/img/Login.jpg",
      selectIn: 'select',
      selectUp: ''
    });

});
router.post('/', loginSlowDown, loginLimiter, login);

export default router;