import express, { response } from 'express';
import { register } from '../controllers/registerController.js';
import { registerLimiter } from '../middlewares/security/registerLimiter.js';
import { registerSlowDown } from '../middlewares/security/registerSlowDown.js';

var router = express.Router();

router.get("/", function(req, res, next){

    res.status(200).render('register',{
        title: "MakeDay - Start your journey!",
        aling: '2',
        skewySide: 'skewY(-1deg)',
        background: "/img/Login-up.jpg",
        selectIn: '',
        selectUp: 'select'
    });

});

router.post('/', registerSlowDown, registerLimiter, register);

export default router;