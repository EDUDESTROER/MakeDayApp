import { mergeSettings } from "./settings.service.js";
import { searchTitle, searchContent } from "../repositories/notes.repository.js";

export async function checkSettingsSearchService(term, id){

    const allSettings = await mergeSettings(id);

    //console.log('All settings: ', allSettings);

    const result = allSettings.filter(settings => settings.key.toLowerCase().includes(term.toLowerCase()));

    //console.log('filter settings: ', result);

    if(!result) return [];

    return result;

}
export async function checkNotesTitleSearchService(term, id){

   const notes = await searchTitle(term, id);

   //console.log('filter by title: ', notes);

   if(!notes) throw new Error('Error in search title notes: term', term, 'id ', id)

   return notes;

}
export async function checkNotesContentService(term, id){

    const notes = await searchContent(term, id);

    //console.log('filter by content: ', notes);

    if(!notes) throw new Error('Error in search notes content: term', term, 'id ', id);

    return notes;

}