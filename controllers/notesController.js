import { success } from "zod";
import { 
    createNoteService, 
    getUserNoteService, 
    updateNoteService, 
    updateNameService, 
    updateIconService,
    updateBackgroundService,
    updateFavorite
} from "../services/notes.service.js";

export async function createNote(req, res){

    try{

        const SendUserId = req.session.user.id;

        //console.log(req.body);

        const {title, parentId, icon, emoji} = req.body;

        const favorite = req.body.favorite === "true" ? true : false;

        const content = JSON.parse(req.body.content);

        const image = req.file ? req.file.filename : null;
        
        //console.log(title, parentId, icon, content, image, favorite);

        const note = await createNoteService(
            SendUserId,
            title,
            parentId,
            icon,
            emoji,
            image,
            content,
            favorite
        );

        const {userId: resUserId, ...safeNote} = note

        //console.log(note);
        //console.log(resUserId);
        //console.log(safeNote);
        
        res.status(201).json(safeNote);

    } catch (error) {

        //console.log(error);

        res.status(400).json({ error: error.message });

    }

}
export async function updateNote(req, res){

    try{

        const SendUserId = req.session.user.id;

        //console.log(req.body);
        //console.log('Favorite body: ', req.body.favorite);

        const {id, title, parentId, icon, emoji, content, favorite, image} = req.body;
        
        //console.log(id, title, parentId, icon, emoji, content, favorite, image);

        const note = await updateNoteService(
            SendUserId,
            id,
            title,
            parentId,
            icon,
            emoji,
            image,
            content,
            favorite
        );

        const {userId: resUserId, ...safeNote} = note

        //console.log(note);
        //console.log(resUserId);
        //console.log(safeNote);
        
        res.status(201).json(safeNote);

    } catch (error) {

        //console.log(error);

        res.status(400).json({ error: error.message });

    }

}
export async function updateName(req, res){

    try{

        const{ newTitle, id } = req.body;
        const userId = req.session.user.id;

        //console.log('alterate name to: ', newTitle, ' Of note: ', id);

        const result = await updateNameService(
            userId,
            id,
            newTitle
        );

        //console.log(result);
        
        res.status(201).json(result);

    }catch(error){

        //console.log(error);

        res.status(400).json({error: error.message});

    }


}
export async function changeFavorite(req, res){


    try{

        const{ favorite, id } = req.body;
        const userId = req.session.user.id;

        //console.log(id);

        const result = await updateFavorite(
            userId,
            id,
            favorite
        );

        //console.log(result);
        
        res.status(201).json(result);

    }catch(error){

        //console.log(error);

        res.status(400).json({error: error.message});

    }

}
export async function updateBackground(req, res){

    try{

        //console.log('upload Background: ', req.body);

        const {id, oldImage} = req.body;
        const image = req.file ? req.file.filename : null;
        const userId = req.session.user.id;

        const result = await updateBackgroundService(
            userId,
            id,
            image,
            oldImage
        );

        res.status(201).json(result);

    }catch(err){

        //console.error(err);

        res.status(400).json({error: err.message});

    }

}
export async function updateIcon(req, res){

    try{

        const{ id, old, emoji, icon } = req.body;
        const userId = req.session.user.id;

        //console.log('alterate icon to: ', icon, ' or ', emoji, ' Of note: ', id);

        const result = await updateIconService(
            userId,
            id, 
            old, 
            emoji, 
            icon
        );

        //console.log(result);
        
        res.status(201).json(result);

    }catch(error){

        //console.log(error);

        res.status(400).json({error: error.message});

    }


}
export async function getUserNote(req, res){

    try{

        const userId = req.session.user.id;

        const notes = await getUserNoteService(userId);

        //console.log(notes);

        res.status(201).json(notes);

    }catch(err){

        res.status(400).json({error: err.message});

    }

}