import { comparePassword, hashPassword } from "./password.service.js";
import {registerUser, deleteUser, changeEmail, changeName, changeNickname, changeAvatar} from '../repositories/users.repository.js';
import { findAuthByEmail, findAuthByUsername, findAuthById } from '../repositories/users.repository.js';

export async function validateLogin(email, password) {
    
    //console.log(email);

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
export async function deleteThisUser(id){

    try{

        const result = await deleteUser(id);

        if(result[0].affectedRows > 0) return true;

        return false;

    }catch(err){

        throw new Error("Unable to delete User!");

    }

}
export async function changeEmailService(email, id){

    try{

        const result = await changeEmail(email, id);

        //console.log(result);

        if(result[0].affectedRows > 0) return true;

        return false;

    }catch(err){

        throw new Error("Unable to change email!");

    }

}
export async function changeNameService(name, id){

    try{

        const result = await changeName(name, id);

        //console.log(result);

        if(result[0].affectedRows > 0) return true;

        return false;

    }catch(err){

        throw new Error("Unable to change name!");

    }

}
export async function changeNicknameService(nickname, id){

    try{

        const result = await changeNickname(nickname, id);

        //console.log(result);

        if(result[0].affectedRows > 0) return true;

        return false;

    }catch(err){

        throw new Error("Unable to change nickname!");

    }

}
export async function changeAvatarService(path, id){

    try{

        const result = await changeAvatar(path, id);

        //console.log(result);

        if(result[0].affectedRows > 0) return true;

        return false;

    }catch(err){

        throw new Error("Unable to change avatar!");

    }

}
export async function checkUser(id){

    try{

        const user = await findAuthById(id);

        //console.log(user);

        return {
            username: user.username,
            email: user.email,
            image: user.image
        }

    }catch(err){

        throw new Error("Unable to retrieve user information.");

    }

}