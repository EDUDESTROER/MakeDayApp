import { WorkspaceView } from '/js/view/workspace.view.js';
import { CategoryController } from '/js/controllers/CategoryController.js';
import { CategoryModel } from '/js/models/CategoryModel.js';
import { NoteModel } from '/js/models/NoteModel.js';
import { NoteController } from '/js/controllers/NoteController.js';
import { IconsController } from '/js/controllers/iconsController.js';
import { EmojiController } from '/js/controllers/emojiController.js';
import { TimeService } from '../services/time.service.js';
import { GreetingService } from '../services/greeting.service.js';

export class WorkspaceController{

    constructor(){

        this.timeService = new TimeService();
        this.greetingService = new GreetingService(this.timeService);
        this._username;
        this.getUsername();
        this.startEvents();
        this.iconsController = new IconsController();
        this.emojiController = new EmojiController();
        this.workspaceView = new WorkspaceView();
        this.categoryController = new CategoryController(this.workspaceView);
        this.noteController = new NoteController(this, this.workspaceView, this.iconsController, this.emojiController);
        this.categories = new Map();
        this.notes = new Map();
        this.getAllCategories();

    }

    async getUsername(){

        const res = await fetch('/me');
        const user = await res.json();

        this._username =  user.username;

        this.setInfo();

    }

    getCategoryViewMode(id){

        //console.log(this.categories, id);

        const category = this.categories.get(id);

        //console.log(category);

        if(!category) return 'list';

        //console.log(!category.viewMode || category.viewMode === '' || category.viewMode === undefined);

        if(!category.viewMode || category.viewMode === '' || category.viewMode === undefined) return 'list';
        

        return category.viewMode;

    }

    async getAllCategories(){

        try{

            const categories = await this.categoryController.getAll();

            //console.log(categories);

            categories.forEach(cat =>{

                const model = new CategoryModel(cat);

                this.categories.set(model.id, model);

            });

            //console.log(this.categories);

            this.categories.forEach(cat=>{

                this.categoryController.render(cat);

            });

            this.getAllNotes();

        }catch(err){

            //console.error(err);

            alert('Make an error Log on workspace!!!', err);

        }

        

    }

    updateNote(note){

        //console.log('Here! ', note);

        const model = new NoteModel(note);

        if(!model.createdAt || model.createdAt == undefined) {

            model.createdAt = this.notes.get(model.id)?.createdAt;

        }

        //console.log(model);

        this.notes.set(model.id, model);

        //console.log(this.notes);

    }

    async getAllNotes(){

        
        try{

            const notes = await this.noteController.getAll();

            //console.log(notes);

            if(notes.length <= 0) {
                this.workspaceView.flowControl('#welcome-workspace');
                this.categoryController.renderCategoriesEmptyState('all-tasks-content-wrapper');
            }

            notes.forEach(note =>{

                const model = new NoteModel(note);

                this.notes.set(model.id, model);

            });

            //console.log(this.notes);

            this.notes.forEach(note=>{

                this.noteController.render(note);

            });

            this.checkFavorites();
            this.renderSmartPanel();

        }catch(err){

            console.error(err);

            alert('Make an error Log on workspace!!!', err);

        }

    }

    getNoteById(id){

        //console.log(this.notes, id);

        const note = this.notes.get(id);

        //console.log(category);

        if(!note) return new Error('We were unable to find your note :(');
        

        return note;

    }

    checkFavorites(){

        const favorites = this.getFavorites();

        //console.log(this.notes);

        if(favorites.length < 1) return;

        console.log(favorites);

        favorites.forEach(note => {

            this.noteController.renderFavorites(note);

        });

    }

    renderSmartPanel(){

        const historyNotes = this.getHistory();

        historyNotes.forEach(note=>{

            const deadLineTxt = this.getDeadLine(note.deadLine || 'none', 'text');

            const steps = {
                done: note.steps?.done || '0',
                notDone: note.steps?.notDone || '0'
            }

            const timeToFinish = this.getFormatTimeToGo(note.timeToFinish);

            this.workspaceView.renderSmartDashboard(note, deadLineTxt, steps, timeToFinish);

        });

    }

    getFormatTimeToGo(time){

        if(!time || time === undefined) return 'No timer';

    }

    getDeadLineList(type){

        const textList = {
            'fine': 'fine',
            'danger': 'danger',
            'warn': 'warn'
        }

        if(type === 'text') return textList;

    }

    getDeadLine(date, type){

        const list = this.getDeadLineList(type);

        if(date === 'none' || !date) return list['fine'];

    }


    getFavorites(){

        return [...this.notes.values()].filter( note => note.favorite );

    }

    getHistory(){

        return [...this.notes.values()]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 6);

    }
    
    getWelcome(){

        return `${this.greetingService.getGreeting()}, ${this._username} 👋`;

    }
    getDayWelcome(){

        return this.timeService.getFullDateFormated();

    }

    setInfo(){

        document.getElementById('username').textContent = this._username;
        document.getElementById('presentation-header-name').textContent = this.getWelcome();
        document.getElementById('presentation-header-day').textContent = this.getDayWelcome();

    }

    startEvents(){

        const actions = {
            "showTarget": (elOrigin, elTarget) => this.openElement(elTarget),
            "returnTo": (elOrigin, elTarget) => this.checkState(elTarget),
            "createNote": (elOrigin, sheet, elTarget) => this.createNote(sheet, elTarget),
            "select-new-category": (elOrigin, typeTarget) => this.categoryController.changeBtnStyle(elOrigin),
            "createNewCategory": (elOrigin) => this.createNewCategory(elOrigin),
            "select-new-note-icon": (elOrigin, iconName, iconStyle) => this.noteController.changeNoteIcon(elOrigin, iconName, iconStyle),
            "select-new-note-emoji": (elOrigin, emoji) => this.noteController.changeNoteEmoji(elOrigin, emoji),
            "createNewNote": (elOrigin) => this.createNewNote(elOrigin),
            "openNote": (noteId) => this.guideOpenNote(noteId),
            "toggleIconsEmojis": (elOrigin) => this.workspaceView.toggleIconsEmojis(elOrigin)
        };

        const wrapperHeader = document.querySelector('.wrapper-header');
        const leftSideBar = document.querySelector('#left-side-bar');
        const bottomBar = document.querySelector('.bottom-bar-wrapper');
        const wrapperCategoryStyle = document.querySelectorAll('.new-category-styles');
        const wrappersSubmitNew = document.querySelectorAll('.wrapper-submit-new');
        const newNoteWrapper = document.querySelectorAll('.new-note-icons');
        const wrapperNoteBtn = document.querySelector('.wrapper-note-btn');
        const wrapperEmptyState = document.querySelector('.wrapper-button-empty-state');
        const smartHistory = document.querySelector('.wrapper-smart-history');
        const wrapperIconsBtn = document.querySelector('.wrapper-icons-btn');
        const wrapperEmojisBtn = document.querySelector('.new-note-emojis');

        wrapperEmojisBtn.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        wrapperIconsBtn.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        leftSideBar.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        smartHistory.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        wrapperEmptyState.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        wrapperNoteBtn.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        })
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
        const noteId = el.dataset.noteId;
        const newNoteEmoji = el.dataset.emoji;

        //console.log(actions);

        const handle = actions[action];


        if(!target && noteId){

            if(handle){

                handle(noteId);

            }

        }else if(!target && newNoteEmoji){
            if(handle){

                handle(el, newNoteEmoji);

            }
        }else if(target && !parentId){
                
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

        this.noteController.noteReset();
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

            console.error(error);

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

            console.log(notesModel);

            this.notes.set(notesModel.id, notesModel);

            //console.log(this.categories);
            //console.log(this.notes);

            // Send to view 
            this.noteController.render(notesModel);
            this.noteController.openNote(notesModel);

            this.checkFavorites();

        }catch(error){

            console.error(error);

            this.noteController.error('Create error', error); // temporary

        }finally{

            clickBtn.disabled = false;

        }

    }

    guideOpenNote(noteId){

        const note = this.getNoteById(noteId);

        //console.log(note);

        this.noteController.openNote(note);

    }

    openElement(target){

        this.workspaceView.flowControl(target);

    }
    
}