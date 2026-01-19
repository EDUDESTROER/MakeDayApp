import express from 'express';

var router = express.Router();

router.get("/", function(req, res, next){

    res.status(200).render('login');

});

export default router;