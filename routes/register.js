import express, { response } from 'express';
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

    const { 
        nickName,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        terms
    } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let validEmail = emailRegex.test(email);

    console.log('Nickname ', nickName);
    console.log('Firstname ', firstName);
    console.log('Lastname ', lastName);
    console.log('Email ', email);
    console.log('Password ', password);
    console.log('Confirm Password ', confirmPassword);
    console.log('Terms ', terms);

    if(terms){

        if((password) && (password === confirmPassword)){

            if(validEmail){

                if(nickName && firstName && lastName){

                    users.register(nickName, firstName, lastName, email, password).then(response=>{

                        users.loginEmail(email, password).then(user=>{

                            req.session.user = user;

                            res.json({
                                redirectUrl: '/workspace'
                            });

                        }).catch(err=>{ // Create a list of error

                            return res.status(401).json({
                                gravity: 0,
                                error: 'Internal Server Error!'
                            });

                        });

                    }).catch(err=>{ // Create a list of error

                        return res.status(401).json({
                            gravity: 0,
                            error: 'Internal Server Error!'
                        });

                    });

                }else{

                    return res.status(400).json({
                        gravity: 0,
                        error: 'Nickname or Last name or First Name is empty...'
                    });

                }

            }else{

                return res.status(400).json({
                    gravity: 0,
                    error: 'Entry a valid Email...'
                });

            }

        }else{

            return res.status(400).json({
                gravity: 0,
                error: 'The password fields must not be empty...'
            });

        }

    }else{

        return res.status(400).json({
            gravity: 0,
            error: 'You must accept the terms...'
        });

    }

});

export default router;