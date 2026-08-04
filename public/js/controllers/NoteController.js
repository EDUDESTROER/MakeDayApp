import { NoteView } from "/js/view/note.view.js";
import { EditorController } from '/js/editor/editor.controller.js';

export class NoteController{

    constructor(workspaceController, workspaceView, iconsController, emojiController){

        this.workspaceView = workspaceView;
        this.workspaceController = workspaceController;
        this.noteView = new NoteView(this.workspaceView);
        this.editorController = new EditorController(this);
        this.firstNoteId = this.getUuid();
        this.iconsController = iconsController;
        this.emojiController = emojiController;

        this.defaultContent = {
            byId: {
                [this.firstNoteId]: {
                    id: this.firstNoteId,
                    type: "paragraph",
                    content: "",
                    children: [],
                    parentId: null
                }
            },
            rootIds: [this.firstNoteId]
        };

        this.state = {
            title: '',
            parentId: '',
            icon: 'fa-solid fa-question',
            emoji: '',
            image: null,
            content: this.defaultContent,
            favorite: false
        }

        this.showResultType = '';

        this.inputTitle = document.querySelector('#input-new-note-name');

        this.inputImage = document.querySelector('#new-note-image');

        this.contextMenuEl = document.getElementById('all-notes-contextMenu');

        this.selectedIconBtn = '';
        this.selectedEmojiBtn = '';
        

        this.init();

    }

    getUuid(){

        if(typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();

        return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);

    }

    init(){

        this.inputTitle.addEventListener('input', e =>{

            this.setTitle(e.target.value);
            this.iconsController.setSearch(e.target.value.toLowerCase().trim());
            this.emojiController.setSearch(e.target.value.toLowerCase().trim());

        });

        this.inputImage.addEventListener('change', e => {

            this.setImage(e.target.files[0]);

        });

    }

    setParent(parent){

        this.state.parentId = parent;

        this.checkParentStyle();

    }

    setImage(file){

        if(file){
            this.state.image = file;
        }else{
            this.state.image = null;
        }
        this.updateNotePreviewImage();

    }

    setTitle(value){

        this.state.title = value.trim();
        this.updatePreviewTitle();

    }

    setIcon(icon){

        //console.log(typeof icon);

        this.state.icon = icon;
        this.state.emoji = '';
        this.updatePreviewIcon();

    }
    setEmoji(emoji){

        this.state.emoji = emoji;
        this.state.icon = '';
        this.updatePreviewEmoji();

    }

    setContent(content){

        this.state.content = content;

    }

    async create(){

        if(!this.state.title){

            throw new Error('Note name cannot be empty.');

        }

        const formData = new FormData();

        formData.append('title', this.state.title);
        formData.append('parentId', this.state.parentId);
        formData.append('icon', this.state.icon);
        formData.append('emoji', this.state.emoji);
        formData.append('image', this.state.image);
        formData.append('content', JSON.stringify(this.state.content));
        formData.append('favorite', this.state.favorite);

        //console.log('Front => before post: ', [...formData.entries()]); //FormData is not a common object.

        const response = await fetch('/notes', {
            method: 'POST',
            body: formData
        });

        if(!response.ok) throw new Error('Failed to create note');

        //console.log('Front => after post: ', await response.json());

        return await response.json();

    }

    async getAll(){

        const response = await fetch('/notes', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) throw new Error('Failed to get all notes');

        return await response.json();

    }

    async saveNote(){

        try{

            if(!this.state.title){

                throw new Error('Note name cannot be empty.');

            }

            //console.log('Salvando: ', this.state);

            const response = await fetch('/notes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(this.state),
            });

            const updatedNote = await response.json();

            //console.log('Front => after post: ', updatedNote);

            if(!response.ok) throw new Error('Failed to update note');

            this.workspaceController.updateNote(updatedNote);

        }catch(err){

            console.error(err);

            alert('Make an error Log on NoteController!!!', err);

        }

    }
    async renameNote(id, newTitle){

        try{

            if(!newTitle){

                throw new Error('Note name cannot be empty.');

            }

            //console.log('Change the name of: ', id,' To: ', newTitle);

            const response = await fetch('/notes/new-name', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    id,
                    newTitle
                }),
            });

            const updatedNote = await response.json();

            //console.log('result: ', updatedNote);

            if(updatedNote.id) this.updateTitle(updatedNote);

            if(!response.ok || !updatedNote.id) throw new Error('Failed to update note');

        }catch(err){

            console.error(err);

            alert('Make an error Log on NoteController!!!', err);

        }

    }
    async changeIcon(id, old, emoji, icon){

        //console.log('Change note: ', id, ' icon of ', old, ' to: ', icon, ' or: ', emoji);

        try{

            if(!id){

                throw new Error('Note empty.');

            }

            //console.log('Change the name of: ', id,' To: ', newTitle);

            const response = await fetch('/notes/new-icon', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    id,
                    old,
                    emoji,
                    icon
                }),
            });

            const updatedNote = await response.json();

            //console.log('result: ', updatedNote);
            
            if(updatedNote.id) this.updateIcon(updatedNote);

            if(!response.ok || !updatedNote.id) throw new Error('Failed to update note');

        }catch(err){

            console.error(err);

            alert('Make an error Log on NoteController!!!', err);

        }


    }

    async changeBackground(id, file, oldImage){

        try{

            //console.log('Change background of: ', id, ' to ', file.name);

            const formData = new FormData();

            formData.append('id', id);
            formData.append('image', file);
            formData.append('oldImage', oldImage);

            //console.log('Front => before post: ', [...formData.entries()]); //FormData is not a common object.

            const response = await fetch('/notes/new-background', {
                method: 'PATCH',
                body: formData
            });

            const updatedNote = await response.json();

            if(updatedNote.id) this.updateBackground(updatedNote);

            if(!response.ok || !updatedNote.id) throw new Error(`Failed to update backgroun of ${id}`);

        }catch(err){

            //console.error(err);

            alert('Make an error Log on NoteController!!!', err);

        }

    }

    deleteNote(id, image, password){

        console.log('deleting note: ', id);

    }

    async changeNoteFavorites(id, favorite){

        try{

            if(!id){

                throw new Error('Select a note first.');

            }

            /*if(favorite){
                console.log('Adding note: ', id,' To favorites');
            }else{
                console.log('Removing note: ', id,' To favorites');
            }*/

            const response = await fetch('/notes/favorites', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    id,
                    favorite
                }),
            });

            const updatedNote = await response.json();

            //console.log('result: ', updatedNote);

            if(updatedNote.id) this.updateFavorites(updatedNote);

            if(!response.ok || !updatedNote.id) throw new Error('Failed to update note');

        }catch(err){

            console.error(err);

            alert('Make an error Log on NoteController!!!', err);

        }

    }

    updateFavorites(note){

        const oldContent = this.workspaceController.getNoteById(note.id);

        oldContent.favorite = note.favorite;

        const newContent = {...oldContent};

        this.workspaceController.notes.set(newContent.id, newContent);

        this.noteView.clearFavorites();
        
        this.workspaceController.checkFavorites();  

    }

    updateBackground(note){

        const oldContent = this.workspaceController.getNoteById(note.id);

        oldContent.image = note.image;

        const newContent = {...oldContent};

        this.workspaceController.notes.set(newContent.id, newContent);

        this.noteView.updateCategoriesCard(newContent.id, newContent.image);

        if(this.state.id = newContent.id){

            this.state = structuredClone(newContent);

            this.noteView.setInAllNote(newContent.title, newContent.icon, newContent.emoji, newContent.image);

        }

    }


    updateIcon(note){

        const oldContent = this.workspaceController.getNoteById(note.id);

        //console.log(oldContent);

        oldContent.icon = note.icon;
        oldContent.emoji = note.emoji;

        const newContent = {...oldContent};

        this.workspaceController.notes.set(newContent.id, newContent);

        this.noteView.updateIconInCategories(newContent.id, newContent.icon, newContent.emoji);

        if(this.state.id === newContent.id){

            this.state = structuredClone(newContent);
            this.noteView.setInAllNote(newContent.title, newContent.icon, newContent.emoji, newContent.image);

        }

    }

    updateTitle(note){

        const oldContent = this.workspaceController.getNoteById(note.id);

        oldContent.title = note.title;

        const newContent = {...oldContent};

        //console.log(newContent);

        this.workspaceController.notes.set(newContent.id, newContent);

        this.noteView.updateNoteTitleInCategories(newContent.id, newContent.title);

        if(this.state.id === newContent.id){

            this.state = structuredClone(newContent);
            this.noteView.setInAllNote(newContent.title, newContent.icon, newContent.emoji, newContent.image);

        }

        //console.log(this.state);

    }

    render(note){

        //console.log(note);

        this.updateShowType(note.parentId);
        this.noteView.renderNote(note, this.showResultType);
        this.noteReset();

    }
    renderFavorites(note){

        this.noteView.renderFavoritesView(note);

    }

    openNote(note){

        this.workspaceController.openElement('#all-note');

        /*console.log(note);
        console.log(this.workspaceController.notes.get(note.id));*/

        this.contextMenuEl.dataset.noteId = note.id;

        this.state = structuredClone(note); 

        this.noteView.setInAllNote(note.title, note.icon, note.emoji, note.image);

        this.editorController.setContent(note.content);
        this.editorController.render();

    }

    noteReset(){

        this.state.title = '';
        this.state.parentId = '';
        this.state.icon = 'fa-solid fa-question';
        this.state.emoji = '❓';
        this.state.image = null;
        this.state.content = this.defaultContent;
        this.state.favorite = false;
        this.updatePreviewTitle();
        this.resetNoteImage();
        this.updatePreviewIcon();
        this.updatePreviewEmoji();
        this.inputTitle.value = '';

        this.iconsController.setSearch(this.inputTitle.value.toLowerCase().trim());
        this.emojiController.setSearch(this.inputTitle.value.toLowerCase().trim());

        this.inputImage.value = '';

        if(this.selectedIconBtn) this.selectedIconBtn.classList.remove('select-style');
        if(this.selectedEmojiBtn) this.selectedEmojiBtn.classList.remove('select-style');

        
        this.updateShowType(this.state.parentId);


    }

    resetNoteImage(){

        this.noteView.resetPreviewImage();

    }

    updateShowType(update){

        this.showResultType = this.workspaceController.getCategoryViewMode(update);

    }

    checkParentStyle(){

        this.updateShowType(this.state.parentId);

        //console.log(this.showResultType);

        this.noteView.showResult(this.showResultType);

        this.noteView.showChooseImageWrapper(this.showResultType);

    }

    changeNoteIcon(targetBtn, iconName, iconStyle){

        //console.log(targetBtn, iconName, iconStyle);

        this.setIcon(`${iconStyle} ${iconName}`);

        const buttons = targetBtn.parentElement.children;

        this.selectedIconBtn = targetBtn;

        Array.from(buttons).forEach(btn => {

            btn.classList.toggle('select-style', btn === targetBtn);

        });

    }
    changeNoteEmoji(targetBtn, emoji){

        //console.log(targetBtn, emoji);

        this.setEmoji(emoji);

        const buttons = targetBtn.parentElement.children;

        this.selectedEmojiBtn = targetBtn;

        Array.from(buttons).forEach(btn => {

            btn.classList.toggle('select-style', btn === targetBtn);

        });

    }

    toggleStyles(style){

        this.workspaceView.unShowEl(`#${this.stylesWrappers[this.focusWrapper].id}`);

        this.workspaceView.showEl(`#${this.stylesWrappers[style].id}`);

        this.focusWrapper = style;

        this.state.viewMode = style.toLowerCase();
        
    }

    updatePreviewTitle(){

        this.noteView.updateNotePreviewTitle(
            this.state.title || 'Note Name'
        );

    }
    updateNotePreviewImage(){

        //console.log(this.state);

        this.noteView.updateNotePreviewImage(
            this.state.image || null
        );

    }
    updatePreviewIcon(){

        this.noteView.updateNotePreviewIcon(
            this.state.icon || 'fa-solid fa-question'
        );

    }
    updatePreviewEmoji(){

        this.noteView.updateNotePreviewEmoji(
            this.state.emoji || '❓'
        );

    }
    error(where, error){

        let log = '';
        
        if(where === 'Create error'){

            log = '#create-new-category-error';

            this.workspaceView.errorLog(log, error);

            this.inputTitle.classList.add('input-error');

            setTimeout(()=>{
                this.workspaceView.errorLog(log, '');
                this.inputTitle.classList.remove('input-error');
            },5000);

        }
        

    }

}