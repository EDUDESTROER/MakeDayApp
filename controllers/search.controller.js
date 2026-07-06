import searchSchema from "../schemas/search.schema.js";
import * as z from 'zod';
import {
    checkSettingsSearchService,
    checkNotesTitleSearchService,
    checkNotesContentService
} from "../services/search.service.js";

export async function searchTerm(req, res){
    
    try{

        const { term } = req.query;

        const validation = searchSchema.safeParse({term});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
            
            const firstValue = Object.values(errors.fieldErrors)[0];

            return res.status(422).json({
                gravity: 0,
                error: firstValue || 'error zod'
            });

        }

        const {term: validTerm} = validation.data;

        //console.log('Search this: ', validTerm);

        const matchSettings = await checkSettingsSearchService(validTerm, req.session.user.id);

        const matchNoteByTitle = await checkNotesTitleSearchService(validTerm, req.session.user.id);

        const matchNoteByContent = await checkNotesContentService(validTerm, req.session.user.id);

        //console.log('Search Settings: ', matchSettings);
        //console.log('Search Notes Title: ', matchNoteByTitle);
        //console.log('Search Notes Content: ', matchNoteByContent);

        const result = {
            settings: matchSettings,
            notesTitle: matchNoteByTitle,
            notesContent: matchNoteByContent
        }

        res.status(200).json(result);


    }catch(err){

        console.error(err);

        return res.status(401).json({
            gravity: 10,
            error: 'Unable to recover search -_-'
        });

    }

}