import registerSchema from '../schemas/register.schema.js';
import { z } from 'zod';
import { CreateUser } from '../services/auth.service.js';
import { createUserSession } from '../services/session.service.js';

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

        createUserSession(req, res, user);

    }catch(err){

        //console.log('Recived error: ', err);

        return res.status(422).json({
            gravity: 0,
            error: err.message
        });

    }
    
}