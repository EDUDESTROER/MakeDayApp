import express from 'express';
import users from '../inc/users.js';
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 try for IP
    handler: (req, res)=>{

      return res.status(429).json({
        gravity: 5,
        error: "Too many login attempts. Please try again later."
      });

    },
    standardHeaders: true,
    legacyHeaders: false
});

var router = express.Router();

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
router.post('/', loginLimiter, async(req, res)=>{

  const {email, password} = req.body;

  //console.log('Email:', email);
  //console.log('Senha:', password);

  if(email){

    if(password){

      if(email.indexOf('@') > -1){

        users.loginEmail(email, password).then(user=>{

          req.session.user = user;

          res.json({
            redirectUrl: '/workspace'
          });

        }).catch(err=>{ // Create a list of error

          return res.status(401).json({
            gravity: 0,
            error: 'Invalid Email or Password!'
          });

        });

      }else if(email.indexOf('@') <= -1){

        users.loginUsername(email, password).then(user=>{

          req.session.user = user;

          res.json({
            redirectUrl: '/workspace'
          });

        }).catch(err=>{ // Create a list of error

          return res.status(401).json({
            gravity: 0,
            error: 'Invalid Username or Password!'
          });

        });

      }

    }else{

      return res.status(400).json({
        gravity: 0,
        error: 'The password field is required...'
      });

    }

  }else{

    return res.status(400).json({
      gravity: 0,
      error: 'The email field is required...'
    });

  }

});

export default router;