import { checkUser } from "../services/auth.service.js";
import loginSchema from '../schemas/login.schema.js';
import nameSchema from '../schemas/name.schema.js';
import nicknameSchema from '../schemas/nickname.schema.js';
import { validateLogin, deleteThisUser, changeEmailService, changeNameService, changeNicknameService, changeAvatarService} from '../services/auth.service.js';
import { createUserSession, deleteUserSession } from '../services/session.service.js';
import { getUserNoteService } from '../services/notes.service.js';
import { deleteUserFiles } from '../utils/deleteUserUploads.js';
import * as z from 'zod';
import { processAvatar } from '../utils/processAvatar.js';
import crypto from 'crypto';

export async function getUserInfo(req, res){
    
    try{

        const userInfo = await checkUser(req.session.user.id);

        res.json(userInfo);

    }catch(err){

        req.session.destroy();

        return res.status(401).json({
            gravity: 10,
            error: 'Unable to recover user -_-'
        });

    }

}
export async function deleteUser(req, res){
    
    try{

        const userToDelete = req.body;

        //console.log('User to delete: ', userToDelete);

        const validation =  loginSchema.safeParse(userToDelete);

        if(!validation.success){

            //console.log('error validation: ', validation);

            return res.status(422).json({
                gravity: 0,
                error: 'invalid email or password'
            });

        }

        //console.log('Zod validation: ', validation.success);

        const {email, password} = validation.data;

        //console.log('Email:', email);
        //console.log('Senha:', password);

        const user = await validateLogin(email, password);

        if(!user){
        
            return res.status(401).json({
                gravity: 0,
                error: 'Invalid Email or Password'
            });
        
        }else{

            const userMedia =  await checkUser(user.id);

            const userAvatar = userMedia.image;
            const notes = await getUserNoteService(user.id);

            console.log('tipo:', typeof notes);

            deleteUserFiles(userAvatar, notes);
        
            const result = deleteThisUser(user.id);

            if(result) deleteUserSession(req, res);
        
        }

        res.status(200).json({
            sucess: true,
            redirectUrl: '/'
        });

    }catch(err){

        //req.session.destroy();

        console.error(err);

        return res.status(401).json({
            gravity: 10,
            error: 'Unable to recover user -_-'
        });

    }

}
export async function changeEmail(req, res){

    try{

        const toChangeEmail = req.body;

        const user = await checkUser(req.session.user.id);

        const validation = loginSchema.safeParse(toChangeEmail);

        //console.log(toChangeEmail);

        if(!validation.success){

            //console.log('error validation: ', validation);

            return res.status(422).json({
                gravity: 0,
                error: 'invalid email or password'
            });

        }

        const {email, password} = validation.data;

        //console.log(user.email, password);

        const isUser = await validateLogin(user.email, password);

        if(!isUser){
        
            return res.status(401).json({
                gravity: 0,
                error: 'Invalid Email or Password'
            });
        
        }else{

            const result = await changeEmailService(email, req.session.user.id);

            //console.log(result);

            if(result){

                return res.status(200).json({
                    sucess: true
                });

            }else{

                throw new Error("Unable to change email -_-");
                

            }

        }



    }catch(err){

        //console.log(err);

        return res.status(422).json({
            gravity: 0,
            error: err
        });

    }

}
export async function changeName(req, res){

    try{

        const {email:name, password} = req.body; 

        //console.log(name, password);

        const user = await checkUser(req.session.user.id);

        const validation = nameSchema.safeParse({name, password});

        //console.log('validation: ', validation);

        if(!validation.success){

            return res.status(422).json({
                gravity: 0,
                error: 'invalid name or password'
            });

        }

        const {name:validName, password:validPassword} = validation.data;

        //console.log(validName, validName);

        const isUser = await validateLogin(user.email, validPassword);

        if(!isUser){

            return res.status(422).json({
                gravity: 0,
                error: 'invalid name or password'
            });

        }

        const result = await changeNameService(validName, req.session.user.id);

        if(result){

            return res.status(200).json({
                sucess: true
            });

        }else{

            throw new Error("Unable to change name -_-");
                

        }


    }catch(err){

        //console.log(err);

        return res.status(422).json({
            gravity: 0,
            error: err
        });

    }

}
export async function changeNickname(req, res){

    try{

        const {email:nickname, password} = req.body; 

        //console.log(name, password);

        const user = await checkUser(req.session.user.id);

        const validation = nicknameSchema.safeParse({nickname, password});

        //console.log('validation: ', validation);

        if(!validation.success){

            const errors = z.flattenError(validation.error);

            const firstValue = Object.values(errors.fieldErrors)[0];

            return res.status(422).json({
                gravity: 0,
                error: firstValue || 'erro zod'
            });

        }

        const {nickname:validNickname, password:validPassword} = validation.data;

        //console.log(validNickname, validPassword);

        const isUser = await validateLogin(user.email, validPassword);

        if(!isUser){

            return res.status(422).json({
                gravity: 0,
                error: 'invalid nickname or password'
            });

        }

        const result = await changeNicknameService(validNickname, req.session.user.id);

        if(result){

            return res.status(200).json({
                sucess: true
            });

        }else{

            throw new Error("Unable to change name -_-");
                

        }


    }catch(err){

        //console.log(err);

        return res.status(422).json({
            gravity: 0,
            error: err
        });

    }

}
export async function changeAvatar(req, res){

    try{

        //console.log('Exe: change Avatar!');

        const {password} = req.body;

        const image = req.file;

        if (!image) {
            throw new Error('Avatar not provided');
        }

        const user = await checkUser(req.session.user.id);

        const validation = loginSchema.safeParse({email: user.email, password});

        if(!validation.success){

            const errors = z.flattenError(validation.error);

            const firstValue = Object.values(errors.fieldErrors)[0];

            return res.status(422).json({
                gravity: 0,
                error: firstValue || 'erro zod'
            });

        }

        const {email:validEmail, password:validPassword} = validation.data;

        const isUser = await validateLogin(validEmail, validPassword);

        if(!isUser){

            return res.status(422).json({
                gravity: 0,
                error: 'Invalid Email or Password'
            });

        }

        const avatarName = `avatar-${crypto.randomUUID()}.webp`;

        const avatarPath = `uploads/avatares/${avatarName}`;

        //console.log(image.path, user.image, validPassword);

        await processAvatar(
            image.path,
            `uploads/avatares/${user.image}`,
            avatarPath
        );

        const result = await changeAvatarService(avatarName, req.session.user.id);

        if(result){

            return res.status(200).json({
                sucess: true
            });

        }else{

            throw new Error("Unable to change avatar -_-");
                

        }

    }catch(err){

        console.log(err);

        return res.status(400).json({
            gravity: 0,
            error: 'Unable to change avatar -_-'
        });

    }


}