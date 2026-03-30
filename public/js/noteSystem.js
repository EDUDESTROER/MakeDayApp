import {NoteController} from './controllers/NoteController.js';

document.addEventListener('DOMContentLoaded', startNote);

function startNote(){
    new NoteController();
}