import express from 'express';
import users from '../inc/users.js';

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
router.post('/', async(req, res)=>{

  const {email, password} = req.body;

  console.log('Email:', email);
  console.log('Senha:', password);

  if(email){

    if(password){

      if(email.indexOf('@') > -1){

        users.loginEmail(email, password).then(user=>{

          req.session.user = user;

          res.json({
            redirectUrl: '/workspace'
          });

        }).catch(err=>{

          return res.status(401).json({
            gravity: 0,
            error: err || err.message
          });

        });

      }else if(email.indexOf('@') <= -1){

        users.loginUsername(email, password).then(user=>{

          req.session.user = user;

          res.json({
            redirectUrl: '/workspace'
          });

        }).catch(err=>{

          return res.status(401).json({
            gravity: 0,
            error: err || err.message
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