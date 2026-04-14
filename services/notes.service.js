import notesSchema from '../schemas/notes.schema.js';
import { createNewNote } from '../repositories/notes.repository.js';
import * as z from 'zod';

export async function createNoteService(userId, title, parentId, icon, image, content, favorite){

    try{

        if(parentId === '' || parentId === 'null' || parentId === 'undefined') parentId = null;
        
        favorite = favorite === "true" ? true : false ;

        const validation = notesSchema.safeParse({title, parentId, icon, image, content, favorite});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];
                
            throw new Error(firstValue || 'erro zod');

        }

        //console.log('zod validated Data: ', validation.data);

        const id = crypto.randomUUID();

        const {title: testedTitle, parentId: testedParentId, icon: testedIcon, image: testedImage, content: testedContent, favorite: testedFavorite} = validation.data;

        const note = await createNewNote(id, userId, testedTitle, testedParentId, testedIcon, testedImage, testedContent, testedFavorite);

        //console.log(note);

        return note;

    }catch(error){

        throw new Error(error);

    }

}