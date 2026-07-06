import notesSchema from '../schemas/notes.schema.js';
import { createNewNote, getAllNote, updateNote } from '../repositories/notes.repository.js';
import * as z from 'zod';
import { sanitizeNote } from '../utils/sanitizeHtml.js';

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

        const sanitized = sanitizeNote(validation.data);

        const {id: testedId, title: testedTitle, parentId: testedParentId, icon: testedIcon, emoji: testedEmoji, image: testedImage, content: testedContent, favorite: testedFavorite} = sanitized;

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

        //console.log('normalizedContent: ', normalizedContent);

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
        
        const sanitized = sanitizeNote(validation.data);

        const {id: testedId, title: testedTitle, parentId: testedParentId, icon: testedIcon, emoji: testedEmoji, image: testedImage, content: testedContent, favorite: testedFavorite} = sanitized;

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