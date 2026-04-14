import { NoteView } from "/js/view/note.view.js";

export class NoteController{

    constructor(workspaceController, workspaceView){

        this.workspaceView = workspaceView;
        this.workspaceController = workspaceController;
        this.noteView = new NoteView(this.workspaceView);

        this.state = {
            title: '',
            parentId: '',
            icon: 'fa-solid fa-question',
            image: null,
            content: '',
            isFavorite: false
        }

        this.showResultType = '';

        this.inputTitle = document.querySelector('#input-new-note-name');

        this.inputImage = document.querySelector('#new-note-image');

        this.selectedIconBtn = ''
        

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

    async create(){

        if(!this.state.title){

            throw new Error('Note name cannot be empty.');

        }

        const formData = new FormData();

        formData.append('title', this.state.title);
        formData.append('parentId', this.state.parentId);
        formData.append('icon', this.state.icon);
        formData.append('image', this.state.image);
        formData.append('content', this.state.content);
        formData.append('favorite', this.state.isFavorite);

        //console.log('Front => before post: ', [...formData.entries()]); //FormData is not a common object.

        const response = await fetch('/notes', {
            method: 'POST',
            body: formData
        });

        //console.log('Front => after post: ', response);

        if(!response.ok) throw new Error('Failed to create note');

        return await response.json();

    }

    render(note){

        this.noteView.renderNote(note, this.showResultType);
        this.noteReset();

    }

    noteReset(){

        this.state.title = '';
        this.state.parentId = '';
        this.state.icon = 'fa-solid fa-question';
        this.state.image = null;
        this.state.content = '';
        this.state.isFavorite = false;
        this.updatePreviewTitle();
        this.resetNoteImage();
        this.updatePreviewIcon();
        this.inputTitle.value = '';

        this.inputImage.value = '';

        this.selectedIconBtn.classList.toggle('select-style');
        this.showResultType = this.workspaceController.getCategoryViewMode(this.state.parentId);


    }

    resetNoteImage(){

        this.noteView.resetPreviewImage();

    }

    checkParentStyle(){

        this.showResultType = this.workspaceController.getCategoryViewMode(this.state.parentId);

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