import { NoteView } from "/js/view/note.view.js";
import { EditorController } from '/js/editor/editor.controller.js';

export class NoteController{

    constructor(workspaceController, workspaceView, editorController){

        this.workspaceView = workspaceView;
        this.workspaceController = workspaceController;
        this.noteView = new NoteView(this.workspaceView);
        this.editorController = new EditorController(this);
        this.firstNoteId = crypto.randomUUID();

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
            image: null,
            content: this.defaultContent,
            favorite: false
        }

        this.showResultType = '';

        this.inputTitle = document.querySelector('#input-new-note-name');

        this.inputImage = document.querySelector('#new-note-image');

        this.selectedIconBtn = '';
        

        this.init();

    }

    init(){

        this.inputTitle.addEventListener('input', e =>{

            this.setTitle(e.target.value);

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

        this.state.icon = icon;
        this.updatePreviewIcon();

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
        formData.append('image', this.state.image);
        formData.append('content', JSON.stringify(this.state.content));
        formData.append('favorite', this.state.favorite);

        //console.log('Front => before post: ', [...formData.entries()]); //FormData is not a common object.

        const response = await fetch('/notes', {
            method: 'POST',
            body: formData
        });

        //console.log('Front => after post: ', response);

        if(!response.ok) throw new Error('Failed to create note');

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

        this.state = structuredClone(note); 

        this.noteView.setInAllNote(note.title, note.icon, note.image);

        this.editorController.setContent(note.content);
        this.editorController.render();

    }

    noteReset(){

        this.state.title = '';
        this.state.parentId = '';
        this.state.icon = 'fa-solid fa-question';
        this.state.image = null;
        this.state.content = this.defaultContent;
        this.state.favorite = false;
        this.updatePreviewTitle();
        this.resetNoteImage();
        this.updatePreviewIcon();
        this.inputTitle.value = '';

        this.inputImage.value = '';

        if(this.selectedIconBtn) this.selectedIconBtn.classList.toggle('select-style');

        
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

        this.setIcon(`${iconStyle} fa-${iconName}`);

        const buttons = targetBtn.parentElement.children;

        this.selectedIconBtn = targetBtn;

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