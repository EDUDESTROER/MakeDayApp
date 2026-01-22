import express from 'express';
import users from '../inc/users.js';

var router = express.Router();

router.get("/", function(req, res, next){

    res.status(200).render('register',{
        title: "MakeDay - Start your journey!"
    });

});

router.post('/', async(req, res)=>{

    

});

export default router;