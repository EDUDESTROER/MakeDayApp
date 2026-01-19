import express from 'express';

var router = express.Router();

router.get("/", function(req, res, next){

    res.status(200).render('not-found-page');

});

export default router;