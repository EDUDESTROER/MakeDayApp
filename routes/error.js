import express from 'express';

var router = express.Router();

router.get("/", function(req, res, next){

    res.status(200).render('error-page');

});

export default router;