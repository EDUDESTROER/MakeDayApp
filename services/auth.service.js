import { comparePassword } from "./password.service.js";
import { findAuthByEmail, findAuthByUsername } from '../inc/users.js';

export async function validateLogin(email, password) {
    
    const user = email.includes('@')
         ? await findAuthByEmail(email)
         : await findAuthByUsername(email);

    if(!user) return null;

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) return null;

    return {
        id: user.id
    };

}