import express from 'express';
import session from 'express-session';

var router = express.Router();

router.use(function(req, res, next){

    if(['/login'].indexOf(req.url) === -1 && !req.session.user){

        res.redirect('/login');

    }else{

        next();

    }

});

router.get("/", function(req, res, next){

    //console.log(req.session.user.name)

    res.status(200).render('workspace-page', {
        username: req.session.user.name
    });

});

export default router;