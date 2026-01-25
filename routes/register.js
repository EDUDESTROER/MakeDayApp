import express from 'express';
import users from '../inc/users.js';

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

router.post('/', async(req, res)=>{

    

});

export default router;