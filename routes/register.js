import express from 'express';
import { register } from '../controllers/registerController.js';
import { registerLimiter } from '../middlewares/security/registerLimiter.js';
import { registerSlowDown } from '../middlewares/security/registerSlowDown.js';
import { csrfProtection } from '../config/csrf.js';

var router = express.Router();

router.get("/", csrfProtection, function(req, res, next){

    res.status(200).render('register',{
        title: "MakeDay - Start your journey!",
        csrfToken: req.csrfToken(),
        aling: '2',
        skewySide: 'skewY(-1deg)',
        background: "/img/Login-up.jpg",
        selectIn: '',
        selectUp: 'select'
    });

});



router.post('/', csrfProtection, registerSlowDown, registerLimiter, register);

export default router;