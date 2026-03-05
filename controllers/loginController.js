import loginSchema from '../schemas/login.schema.js';
import { validateLogin } from '../services/auth.service.js';
import { createUserSession } from '../services/session.service.js';

export async function login(req, res) {

    const validation = loginSchema.safeParse(req.body);

    if(!validation.success){

        return res.status(422).json({
            gravity: 0,
            error: 'invalid email or password'
        });

    }

    const {email, password} = validation.data;

    //console.log('Email:', email);
    //console.log('Senha:', password);

    const user = await validateLogin(email, password);

    //console.log(user);

    if(!user){

        return res.status(401).json({
            gravity: 0,
            error: 'Invalid Email or Password'
        });

    }else{

        createUserSession(req, res, user);

    }

};
