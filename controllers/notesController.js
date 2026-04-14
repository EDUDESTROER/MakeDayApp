import { createNoteService } from "../services/notes.service.js";

export async function createNote(req, res){

    try{

        const SendUserId = req.session.user.id;

        //console.log(req.body);

        const {title, parentId, icon, content, favorite} = req.body;

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

        res.status(400).json({ error: error.message });

    }

}