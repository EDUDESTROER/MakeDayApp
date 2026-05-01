import { createNoteService, getUserNoteService, updateNoteService } from "../services/notes.service.js";

export async function createNote(req, res){

    try{

        const SendUserId = req.session.user.id;

        //console.log(req.body);

        const {title, parentId, icon} = req.body;

        const favorite = req.body.favorite === "true" ? true : false;

        const content = JSON.parse(req.body.content);

        const image = req.file ? req.file.filename : null;
        
        //console.log(title, parentId, icon, content, image, favorite);

        const note = await createNoteService(
            SendUserId,
            title,
            parentId,
            icon,
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

        const {id, title, parentId, icon, content, favorite, image} = req.body;
        
        //console.log(id, title, parentId, icon, content, favorite, image);

        const note = await updateNoteService(
            SendUserId,
            id,
            title,
            parentId,
            icon,
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