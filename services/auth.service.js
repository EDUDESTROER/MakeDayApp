import { comparePassword, hashPassword } from "./password.service.js";
import {registerUser} from '../repositories/users.repository.js';
import { findAuthByEmail, findAuthByUsername } from '../repositories/users.repository.js';

export async function validateLogin(email, password) {
    
    const user = email.includes('@')
         ? await findAuthByEmail(email)
         : await findAuthByUsername(email);

    if(!user) return null;

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) return null;

    return {
        id: user.id,
        role: user.role
    };

}
export async function CreateUser(data){

    try{
        const password_hash = await hashPassword(data.password);

        const result = await registerUser(data.nickName, data.firstName, data.lastName, data.email, password_hash);

        return {
            id: result[0],
            role: result[1]
        }

    }catch(err){

        throw new Error("Unable to complete registration!");

    }

}