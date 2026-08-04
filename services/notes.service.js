import notesSchema from '../schemas/notes.schema.js';
import noteNameSchema from '../schemas/note.name.schema.js';
import noteIconSchema from '../schemas/note.icon.schema.js';
import backgroundChangeSchema from '../schemas/background.change.schema.js';
import updateFavoriteSchema from '../schemas/update.favorite.schema.js';
import { createNewNote, 
    getAllNote, 
    updateNote, 
    updateNoteName, 
    updateNoteIcon,
    updateNoteBackground,
    updateNoteFavorite
} from '../repositories/notes.repository.js';
import * as z from 'zod';
import { sanitizeNote } from '../utils/sanitizeHtml.js';
import { removeOldBackground } from '../utils/removeOldBackground.js';

export async function createNoteService(userId, title, parentId, icon, emoji, image, content, favorite){

    try{

        if(parentId === '' || parentId === 'null' || parentId === 'undefined') parentId = null;

        const normalizedContent = JSON.parse(JSON.stringify(content));

        const id = crypto.randomUUID();

        //console.log(normalizedContent);
        //console.log(userId, title, parentId, `icon: ${icon}`, `emoji: ${emoji}`, image, content, favorite);

        const validation = notesSchema.safeParse({
            id,
            title, 
            parentId, 
            icon,
            emoji, 
            image, 
            content: normalizedContent, 
            favorite
        });

        //console.log(validation);

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];
                
            throw new Error(firstValue || 'erro zod');

        }

        //console.log('zod validated Data: ', validation.data);

        //const sanitized = sanitizeNote(validation.data);

        const {id: testedId, title: testedTitle, parentId: testedParentId, icon: testedIcon, emoji: testedEmoji, image: testedImage, content: testedContent, favorite: testedFavorite} = validation.data;

        const searchContent = getText(testedContent);

        //console.log('search column: ', searchContent);

        const note = await createNewNote(testedId, userId, testedTitle, testedParentId, testedIcon, testedEmoji, testedImage, testedContent, testedFavorite, searchContent);

        //console.log(note);

        return note;

    }catch(error){

        //console.log(error);

        throw new Error(error);

    }

}
export async function updateNoteService(
        userId,
        id,
        title, 
        parentId, 
        icon,
        emoji, 
        image, 
        content, 
        favorite
    ){

    try{

        if(parentId === '' || parentId === 'null' || parentId === 'undefined') parentId = null;

        if(favorite == 0) favorite = false;
        if(favorite == 1) favorite = true;

        //console.log('Content: ', content);

        /*console.log('To validated Data: ', {
            id,
            title, 
            parentId, 
            icon, 
            image, 
            content, 
            favorite
        });*/

        const validation = notesSchema.safeParse({
            id,
            title, 
            parentId, 
            icon,
            emoji, 
            image, 
            content, 
            favorite
        });

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];
                
            throw new Error(firstValue || 'erro zod');

        }

        //console.log('zod validated Data: ', validation.data);
        
        //const sanitized = sanitizeNote(validation.data);

        const {id: testedId, title: testedTitle, parentId: testedParentId, icon: testedIcon, emoji: testedEmoji, image: testedImage, content: testedContent, favorite: testedFavorite} = validation.data;

        const searchContent = getText(testedContent);

        //console.log('search column: ', searchContent);

        const note = await updateNote(testedId, userId, testedTitle, testedParentId, testedIcon, testedEmoji, testedImage, testedContent, testedFavorite, searchContent);

        //console.log(note);

        return note;

    }catch(error){

        //console.log(error);

        throw new Error(error);

    }

}
export async function updateNameService(userId, id, newTitle){

    try {

        //console.log('alterate name to: ', newTitle, ' Of note: ', id);

        const validation = noteNameSchema.safeParse({id, newTitle});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];
                
            throw new Error(firstValue || 'erro zod');

        }

        //console.log('Zod validation: ', validation.data);
        
        const {id:testedId, newTitle: testedNewTitle} = validation.data;

        const result = await updateNoteName(userId, testedId, testedNewTitle);

        //console.log(result);

        if(result) return {id: testedId, title: testedNewTitle};

        throw new Error('Unable to change note name -_-');

        
    } catch (error) {
        
        throw new Error(error);

    }

}
export async function updateFavorite(userId, id, favorite){

    try {

        //console.log(id, ' to ', favorite);

        const validation = updateFavoriteSchema.safeParse({id, favorite});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];
                
            throw new Error(firstValue || 'erro zod');

        }

        //console.log('Zod validation: ', validation.data);
        
        const {id:testedId, favorite: testedFavorite} = validation.data;

        const result = await updateNoteFavorite(userId, testedId, testedFavorite);

        //console.log(result);

        if(result) return {id: testedId, favorite: testedFavorite};

        throw new Error('Unable to change note favorite -_-');

        
    } catch (error) {
        
        throw new Error(error);

    }

}
export async function updateBackgroundService(userId, noteId, image, oldImage){

    try{

        //console.log('old Image:', oldImage, 'new image: ', image);

        //console.log(typeof oldImage)

        if(oldImage === undefined || oldImage === 'undefined' || !oldImage) oldImage = '';

        const validation = backgroundChangeSchema.safeParse({noteId, image, oldImage});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];

            //console.log(firstValue);
                
            throw new Error(firstValue || 'erro zod');

        }

        const {noteId:testedId, image: testedimage, oldImage: testedOldImage} = validation.data;

        const result = await updateNoteBackground(userId, testedId, testedimage);

        //console.log(result);

        if(testedOldImage) await removeOldBackground(testedOldImage);

        if(result) return {id: testedId, image: testedimage};

        throw new Error('Unable to change note icon -_-');

    }catch(err){

        throw new Error(err);

    }

}
export async function updateIconService(userId, id, old, emoji, icon){

    try {

        if(old === icon) throw new Error('The new icon must be different from the current one.');
        if(old === emoji) throw new Error('The new emoji must be different from the current one.');

        //console.log(icon, emoji);

        if(icon === undefined) icon = '';
        if(emoji === undefined) emoji = '';

        const validation = noteIconSchema.safeParse({id, icon, emoji});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];

            //console.log(firstValue);
                
            throw new Error(firstValue || 'erro zod');

        }

        //console.log('Zod validation: ', validation.data);
        
        const {id:testedId, icon: testedIcon, emoji: testedEmoji} = validation.data;

        const result = await updateNoteIcon(userId, testedId, testedIcon, testedEmoji);

        //console.log(result);

        if(result) return {id: testedId, icon: testedIcon, emoji: testedEmoji};

        throw new Error('Unable to change note icon -_-');

        
    } catch (error) {
        
        throw new Error(error);

    }

    

}
export async function getUserNoteService(userId){

    try{

        const notes = await getAllNote(userId);

        //console.log(notes);

        return notes;

    }catch(err){

        throw new Error(err);

    }

}

function getText(content){

    //console.log(content);

    const result = [];

    function walk(id){
        //console.log(id);
        const node = content.byId[id];

        if(!node) return;

        if(node.type === "paragraph"){
            result.push(node.content);
        }

        for (const childId of node.children){
            walk(childId);
        }

    }
    for(const rootId of content.rootIds){
        walk(rootId);
    }

    return result.join("\n");

}