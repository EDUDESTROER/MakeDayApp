import registerSchema from '../schemas/register.schema.js';
import { z } from 'zod';
import { CreateUser } from '../services/auth.service.js';

export async function register(req, res) {

    const validation = registerSchema.safeParse(req.body);

    if(!validation.success){
        
        const errors = z.flattenError(validation.error);

        const firstValue = Object.values(errors.fieldErrors)[0];

        return res.status(422).json({
            gravity: 0,
            error: firstValue || 'erro zod'
        });

    }

    //console.log(validation);

    try{

        const user = await CreateUser(validation.data);

        req.session.user = user;

        return res.json({ redirectUrl: '/workspace' });

    }catch(err){

        //console.log('Recived error: ', err);

        return res.status(422).json({
            gravity: 0,
            error: err.message
        });

    }



    /*console.log('Nickname ', nickName);
    console.log('Firstname ', firstName);
    console.log('Lastname ', lastName);
    console.log('Email ', email);
    console.log('Password ', password);
    console.log('Confirm Password ', confirmPassword);
    console.log('Terms ', terms);*/

    /*if(terms){

        if((password) && (password === confirmPassword)){

            if(email){

                if(nickName && firstName && lastName){

                    registerUser(nickName, firstName, lastName, email, password).then(response=>{

                        users.loginEmail(email, password).then(user=>{

                            req.session.user = user;

                            res.json({
                                redirectUrl: '/workspace'
                            });

                        }).catch(err=>{ // Create a list of error

                            return res.status(401).json({
                                gravity: 10,
                                error: 'Invalid Email or Password!'
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

    }*/
    
}