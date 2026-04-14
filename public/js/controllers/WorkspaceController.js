import { WorkspaceView } from '/js/view/workspace.view.js';
import { CategoryController } from '/js/controllers/CategoryController.js';
import { CategoryModel } from '/js/models/CategoryModel.js';
import { NoteModel } from '/js/models/NoteModel.js';
import { NoteController } from '/js/controllers/NoteController.js';
import { IconsController } from '/js/controllers/iconsController.js';

export class WorkspaceController{

    constructor(){

        this._username;
        this.getUsername();
        this.startEvents();
        this.workspaceView = new WorkspaceView();
        this.categoryController = new CategoryController(this.workspaceView);
        this.noteController = new NoteController(this, this.workspaceView);
        this.iconsController = new IconsController();
        this.categories = new Map();
        this.notes = new Map();

    }

    async getUsername(){

        const res = await fetch('/me');
        const user = await res.json();

        this._username =  user.username;

        this.setInfo();

    }

    getCategoryViewMode(id){

        const category = this.categories.get(id);
        if(!category) return 'list';
        return category.viewMode;

    }

    setInfo(){

        document.getElementById('username').textContent = this._username;

    }

    startEvents(){

        const actions = {
            "showTarget": (elOrigin, elTarget) => this.openElement(elTarget),
            "returnTo": (elOrigin, elTarget) => this.checkState(elTarget),
            "createNote": (elOrigin, sheet, elTarget) => this.createNote(sheet, elTarget),
            "select-new-category": (elOrigin, typeTarget) => this.categoryController.changeBtnStyle(elOrigin),
            "createNewCategory": (elOrigin) => this.createNewCategory(elOrigin),
            "select-new-note-icon": (elOrigin, iconName, iconStyle) => this.noteController.changeNoteIcon(elOrigin, iconName, iconStyle),
            "createNewNote": (elOrigin) => this.createNewNote(elOrigin),
        };

        const wrapperHeader = document.querySelector('.wrapper-header');
        const leftSideBar = document.querySelector('#left-side-bar');
        const bottomBar = document.querySelector('.bottom-bar-wrapper');
        const wrapperCategoryStyle = document.querySelectorAll('.new-category-styles');
        const wrappersSubmitNew = document.querySelectorAll('.wrapper-submit-new');
        const newNoteWrapper = document.querySelectorAll('.new-note-icons');

        leftSideBar.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        wrapperHeader.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        bottomBar.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        wrapperCategoryStyle.forEach(wrapper=>{

            wrapper.addEventListener('click', e => {

                this.clickHandle(e, actions);

            });

        });
        wrappersSubmitNew.forEach(wrapper=>{

            wrapper.addEventListener('click', e => {

                this.clickHandle(e, actions);

            });

        });
        newNoteWrapper.forEach(wrapper => {

            wrapper.addEventListener('click', e => {

                this.clickHandle(e, actions);

            });

        });

    }

    checkState(target){

        if(!this.workspaceView.wideScreen){

            this.workspaceView.flowControl(target);

        }else{

            this.workspaceView.hiddenMenu(target);
            
        }

    }

    clickHandle(e, actions){

        const el = e.target.closest("[data-action]");

        if(!el) return;

        const action = el.dataset.action;
        const target = el.dataset.target;
        const parentId = el.dataset.parentId;
        const iconName = el.dataset.icon;
        const iconStyle = el.dataset.style;

        //console.log(actions);

        const handle = actions[action];

        if(target && !parentId){
                
            if(handle){

                handle(el, target);

            }

        }else if(target && parentId){
                
            if(handle){

                handle(el, parentId, target);

            }

        }else if(!target && iconName && iconStyle){

            if(handle){

                handle(el, iconName, iconStyle);

            }

        }else{

            actions[action]?.(el);

        }

    }

    createNote(parent, target){

        this.openElement(target);

        if(parent === 'all-notes') parent = null;

        this.noteController.setParent(parent);

    }
    async createNewCategory(clickBtn){

        clickBtn.disabled = true;

        try{

            const categoryData = await this.categoryController.create();

            //console.log(category);

            const categoryModel = new CategoryModel(categoryData);

            this.categories.set(categoryModel.id, categoryModel);

            //this.categories = category.map(cat => new CategoryModel(cat));

            //console.log(this.categories);

            // Send to view 
            this.categoryController.render(categoryModel);

        }catch(error){

            this.categoryController.error('Create error', error); // temporary

        }finally{

            clickBtn.disabled = false;

        }

    }

    async createNewNote(clickBtn){

        clickBtn.disabled = true;

        try{

            const noteData = await this.noteController.create();

            //console.log(noteData);

            const notesModel = new NoteModel(noteData);

            this.notes.set(notesModel.id, notesModel);

            //this.categories = category.map(cat => new CategoryModel(cat));

            //console.log(this.categories);
            //console.log(this.notes);

            // Send to view 
            this.noteController.render(notesModel);

        }catch(error){

            this.noteController.error('Create error', error); // temporary

        }finally{

            clickBtn.disabled = false;

        }

    }

    openElement(target){

        this.workspaceView.flowControl(target);

    }
    
}