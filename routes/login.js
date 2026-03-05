import express from 'express';
import { login } from '../controllers/loginController.js';
import { loginLimiter } from '../middlewares/security/loginLimiter.js';
import { loginSlowDown } from '../middlewares/security/loginSlowDown.js';
import { csrfProtection } from '../configs/csrf.js';

const router = express.Router();


router.get("/", csrfProtection, function(req, res, next){

    res.status(200).render('login',{
      title: "MakeDay - Welcome Back!",
      csrfToken: req.csrfToken(),
      aling: '0',
      skewySide: 'skewX(-1deg)',
      background: "/img/Login.jpg",
      selectIn: 'select',
      selectUp: ''
    });

});
router.post('/', csrfProtection, loginSlowDown, loginLimiter, login);

export default router;