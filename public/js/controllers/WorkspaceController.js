import { WorkspaceView } from '/js/view/workspace.view.js';
import { CategoryController } from '/js/controllers/CategoryController.js';
import { CategoryModel } from '/js/models/CategoryModel.js';
import { NoteModel } from '/js/models/NoteModel.js';
import { NoteController } from '/js/controllers/NoteController.js';
import { IconsController } from '/js/controllers/iconsController.js';
import { EmojiController } from '/js/controllers/emojiController.js';
import { TimeService } from '/js/services/time.service.js';
import { GreetingService } from '/js/services/greeting.service.js';
import { SettingsService } from '/js/services/settings.service.js';
import { SettingsModel } from '/js/models/SettingsModel.js'
import { SettingsView } from '/js/view/settings.view.js'
import { SearchController } from '/js/controllers/searchController.js';
import { ContextMenuController } from '/js/controllers/ContextMenuController.js';

export class WorkspaceController{

    constructor(){

        this.timeService = new TimeService();
        this.greetingService = new GreetingService(this.timeService);
        this.settingsService = new SettingsService();
        this._user = null;

        this.iconsController = new IconsController(document.getElementById("load-more"), document.querySelector('.new-note-icons'), 'select-new-note-icon');
        this.emojiController = new EmojiController(document.getElementById("load-more"), document.querySelector('.new-note-emojis'), 'select-new-note-emoji');
        this.workspaceView = new WorkspaceView();
        this.settingsModel = new SettingsModel();
        this.settingsView = new SettingsView(this.workspaceView);
        this.categoryController = new CategoryController(this.workspaceView);
        this.noteController = new NoteController(this, this.workspaceView, this.iconsController, this.emojiController);
        this.searchController = new SearchController();
        this.contextMenuController = new ContextMenuController(this.workspaceView, this, this.noteController);
        this.categories = new Map();
        this.notes = new Map();

        this.getUserinfo();
        this.getAllCategories();
        this.getAllSettings();
        this.getAllFlameProfile();

        this.startEvents();

    }

    openDeleteAccountModal(){

        this.workspaceView.showEl('#modal-warn');
        this.workspaceView.showEl('#delete-account-wrapper');
        this.unShowMenu('#configs-menu');

    }
    closeDeleteAccountModal(){

        this.workspaceView.unShowEl('#modal-warn');
        this.workspaceView.unShowEl('#delete-account-wrapper');

    }
    openDeleteAccountSubModal(){

        this.workspaceView.showEl('#sub-modal-delete-account');

    }
    closeDeleteAccountSubModal(){

        this.workspaceView.unShowEl('#modal-warn');
        this.workspaceView.unShowEl('#delete-account-wrapper');
        this.workspaceView.unShowEl('#sub-modal-delete-account');
        this.workspaceView.openDisplay('delete-account-sub-modal-one');
        this.workspaceView.closeDisplay('delete-account-sub-modal-two');

    }
    async deleteAccount(){

        const deleteInput = document.getElementById('delete-account-input-delete');
        const passwordInput = document.getElementById('delete-account-input-password');

        if(deleteInput.value === 'DELETE'){

            this.workspaceView.openDisplay('delete-account-sub-modal-two');
            this.workspaceView.closeDisplay('delete-account-sub-modal-one');

            if(passwordInput.value.trim() !== ''){

                try{

                    const res = await fetch('/me/delete', {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email: this._user.email, password: passwordInput.value.trim()})
                    });
                    const resDelete = await res.json();

                    if(resDelete.sucess){

                        window.location.replace(resDelete.redirectUrl);

                    }else{

                        throw new Error('Unable to delete User!');

                    }

                }catch(err){

                    console.error(err);

                }

            }

        }else{

            this.workspaceView.logErrorIn({
                elementToLog: 'delete-account-input-delete-info',
                textToLog: 'Type DELETE!',
                elementsToStyle: ['delete-account-input-delete'],
                elementToClearn: ['delete-account-input-delete']
            });

        }

    }
    async getUserinfo(){

        const res = await fetch('/me');
        const user = await res.json();

        //console.log(user);

        this._user =  user;

        this.setInfo();

    }

    async getAllFlameProfile(){

        try{

            const res = await fetch('/profile-dashboard');
            const dashBoardInfo = await res.json();

            const resAchievements = await fetch('/achievements');

            const achievements = await resAchievements.json();

            //console.log(achievements);

            //console.log(dashBoardInfo);

            this.workspaceView.renderFlameProfile(dashBoardInfo);
            this.workspaceView.renderAchievementsProfile(achievements);

        }catch(err){

            console.error(err)

        }

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

    async getAllSettings(){

        const allSettings = await this.settingsService.getAll();

        this.settingsModel.set(allSettings);

        allSettings.forEach(setting => {
            this.settingsView.assembler(setting);
        });

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

        return `${this.greetingService.getGreeting()}, ${this._user.username} 👋`;

    }
    getDayWelcome(){

        return this.timeService.getFullDateFormated();

    }

    setInfo(){

        this.workspaceView.updateUsernameInView(this._user.username, this.getWelcome());

        this.workspaceView.updateEmailInView(this._user.email);
        //console.log(this._user);

        if(!this._user.image) this.workspaceView.updateUserAvatarInView(`/uploads/avatares/default.png`);
        if(this._user.image) this.workspaceView.updateUserAvatarInView(`/uploads/avatares/${this._user.image}`);

        this.workspaceView.updateApresentationDayInView(this.getDayWelcome());

    }

    showMenu(target){

        if(target === '#configs-menu' && this.workspaceView.wideScreen){

            this.workspaceView.showEl(target);
            this.workspaceView.showEl('#configs-content');


        }else{

            this.workspaceView.showEl(target);
            this.workspaceView.unShowEl('#configs-content');

        }

    }
    unShowMenu(target){

        if(target === '#configs-menu') this.workspaceView.unShowEl(target);
        if(target === '#configs-content'){

            this.workspaceView.unShowEl(`#configs-content`);

            this.workspaceView.showEl(`#left-bar-configs-menu`)

        }

    }
    unShowUserMenu(target){

        this.openElement('#smart-dashboard');
        this.showMenu(target);

    }
    closeChangeAvatarEl(){

        this.workspaceView.unShowEl('#modal-warn');
        this.workspaceView.unShowEl('#change-account-avatar-wrapper');
        this.addEventInChangeAvatar(true);
        this.workspaceView.resetChangeAvatar();

    }
    openChangeAvatarEl(){

        this.unShowMenu('#configs-menu');
        this.workspaceView.showEl('#modal-warn');
        this.workspaceView.showEl('#change-account-avatar-wrapper');
        this.addEventInChangeAvatar(false);

    }
    addEventInChangeAvatar(removeEvent){

        const input = document.getElementById('change-account-avatar-image');

        if(removeEvent){

            input.removeEventListener('change', ()=> this.workspaceView.renderAvatarPreview(null));

        }else{
            
            input.addEventListener('change', ()=> this.workspaceView.renderAvatarPreview(input.files[0]));

        }

    }
    async checkChangeAccountAvatar(){

        const inputFile = document.getElementById('change-account-avatar-image');
        const inputPassword = document.getElementById('change-account-avatar-password');


        if(inputFile.files.length === 0){
            this.workspaceView.logErrorIn({
                elementToLog: 'change-account-avatar-error-log',
                textToLog: `You need to choose a file!`,
                elementsToStyle: ['change-account-avatar-image-accept'],
                elementToClearn: ['change-account-avatar-image']
            });
            return;
        } 
        if(inputPassword.value.trim().length < 5){

            this.workspaceView.logErrorIn({
                elementToLog: 'change-account-avatar-error-log',
                textToLog: `The password Can't be less than 5 caracteres!`,
                elementsToStyle: ['change-account-avatar-password'],
                elementToClearn: ['change-account-avatar-password']
            });
            return;

        }

        const formData = new FormData();

        formData.append('image', inputFile.files[0]);
        formData.append('password', inputPassword.value.trim());

        const res = await fetch('/me/avatar', {
            method: 'POST',
            body: formData
        });

        if(!res.ok) console.error('Fail to change avatar!');

        const resChange = await res.json();

        if(resChange.error){
            this.workspaceView.logErrorIn({
                elementToLog: 'change-account-avatar-error-log',
                textToLog: resChange.error,
                elementsToStyle: ['change-account-avatar-password'],
                elementToClearn: ['change-account-avatar-password']
            });
            this.workspaceView.resetChangeAvatar();
        }else{ 

            this.getUserinfo();

            this.closeChangeAvatarEl();

        }

        //console.log(resChange);

    }
    openChangeAccountInfo(type){

        const typePhrases = {
            'email': ['Change your email', 'Email Address'],
            'name': ['Change your personal name', 'Personal Name'],
            'nickname': ['Change your nickname', 'Nickname']
        }

        this.changeAccountInfo = type;
        this.isShowAccountChangeInfo = false;

        this.unShowMenu('#configs-menu');
        this.workspaceView.showEl('#modal-warn');
        this.workspaceView.showEl('#change-account-info-wrapper');
        
        this.workspaceView.updateModalChangeAccountInfo(typePhrases[type]);
        

    }
    closeChangeAccountInfo(){

        this.changeAccountInfo = false;

        this.workspaceView.unShowEl('#modal-warn');
        this.workspaceView.unShowEl('#change-account-info-wrapper');
        
        this.workspaceView.updateModalChangeAccountInfo(['...', '...']);

        this.workspaceView.openDisplay('wrapper-change-account-first-step');
        this.workspaceView.closeDisplay('wrapper-change-account-last-step');

        this.workspaceView.clearChangeAccountInfoInput();

    }
    async checkChangeAccountInfo(){

        try{

            const firstInput = document.getElementById('change-account-info-first-input');
            const secondInput = document.getElementById('change-account-info-second-input');

            const addressList = {
                'email': '/me/email',
                'name': '/me/name',
                'nickname': '/me/nickname'
            }

            if(firstInput.value.trim().length < 5) {


                throw {
                    elementToLog: 'change-account-info-first-input-response',
                    textToLog: `The ${this.changeAccountInfo} Can't be less than 5 caracteres!`,
                    elementsToStyle: ['change-account-info-first-input'],
                    elementToClearn: ['change-account-info-first-input']
                };

            }else{

                if(!this.isShowAccountChangeInfo){

                    this.workspaceView.closeDisplay('wrapper-change-account-first-step');
                    this.workspaceView.openDisplay('wrapper-change-account-last-step');

                    this.isShowAccountChangeInfo = true;

                }else{

                    if(secondInput.value.trim().length < 5){

                        throw {
                            elementToLog: 'change-account-info-second-input-response',
                            textToLog: `The password Can't be less than 5 caracteres!`,
                            elementsToStyle: ['change-account-info-second-input'],
                            elementToClearn: ['change-account-info-second-input']
                        };

                    }else{

                        const res = await fetch(addressList[this.changeAccountInfo], {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({email: firstInput.value.trim(), password: secondInput.value.trim()})
                        });

                        const resChange = await res.json();

                        //console.log(resChange);

                        if(resChange.sucess){

                            this.getUserinfo();
                            this.closeChangeAccountInfo();

                        }else if(resChange.error){

                            throw {
                                elementToLog: 'change-account-info-second-input-response',
                                textToLog: resChange.error,
                                elementsToStyle: [],
                                elementToClearn: []
                            };

                        }

                    }

                }


            }




        }catch(err){

            //console.log(err);

            this.workspaceView.logErrorIn(err);

        }

    }

    startEvents(){

        const actions = {
            "showTarget": (elOrigin, elTarget) => this.openElement(elTarget),
            "changeUserEmail": (elOrigin) => this.openChangeAccountInfo('email'),
            "changePersonalName": (elOrigin) => this.openChangeAccountInfo('name'),
            "changeNickname": (elOrigin) => this.openChangeAccountInfo('nickname'),
            "changeProfilePhoto": (elOrigin) => this.openChangeAvatarEl(),
            "cancelChangeAccountAvatar": (elOrigin) => this.closeChangeAvatarEl(),
            "checkChangeAccountAvatar": (elOrigin) => this.checkChangeAccountAvatar(),
            "cancelChangeAccountInfo": (elOrigin) => this.closeChangeAccountInfo(),
            "checkChangeAccountInfo": (elOrigin) => this.checkChangeAccountInfo(),
            "openDeleteAccount": (elOrigin) => this.openDeleteAccountModal(),
            "closeDeleteAccount": (elOrigin) => this.closeDeleteAccountModal(),
            "openDeleteAccountSub": (elOrigin) => this.openDeleteAccountSubModal(),
            "closeDeleteAccountSub": (elOrigin) => this.closeDeleteAccountSubModal(),
            "deleteAccount": (elOrigin) => this.deleteAccount(),
            "showConfigs": (elOrigin, elTarget) => this.showMenu(elTarget),
            "unShowConfigs": (elOrigin, elTarget) => this.unShowMenu(elTarget),
            "unShowUserMenu": (elOrigin, elTarget) => this.unShowUserMenu(elTarget),
            "changeSubMenu": (elOrigin, idTarget) => this.settingsView.changeSubMenu(idTarget, elOrigin),
            "ShowSubMenu": (elOrigin, idTarget) => this.settingsView.showBtnSubMenu(idTarget),
            "returnTo": (elOrigin, elTarget) => this.checkState(elTarget),
            "createNote": (elOrigin, sheet, elTarget) => this.createNote(sheet, elTarget),
            "renameNote": (elOrigin)=> this.contextMenuController.renameNote(),
            "changeNoteIcon": (elOrigin)=> this.contextMenuController.newIconNote(),
            "changeNoteBackground": (elOrigin)=> this.contextMenuController.newBackgroundNote(),
            "select-new-category": (elOrigin, typeTarget) => this.categoryController.changeBtnStyle(elOrigin),
            "createNewCategory": (elOrigin) => this.createNewCategory(elOrigin),
            "select-new-note-icon": (elOrigin, iconName, iconStyle) => this.noteController.changeNoteIcon(elOrigin, iconName, iconStyle),
            "select-new-note-emoji": (elOrigin, emoji) => this.noteController.changeNoteEmoji(elOrigin, emoji),
            "createNewNote": (elOrigin) => this.createNewNote(elOrigin),
            "openNote": (elOrigin, noteId) => this.guideOpenNote(noteId),
            "toggleIconsEmojis": (elOrigin) => this.workspaceView.toggleIconsEmojis(elOrigin),
            "openContexMenu": (elOrigin, noteId) => this.contextMenuController.openContextMenu(elOrigin, noteId),
            "cancelChangeNote": (elOrigin) => this.contextMenuController.calcelChange(),
            "checkChangeNote": (elOrigin) => this.contextMenuController.checkChange(),
            "change-note-choose-emoji": (elOrigin) => this.contextMenuController.chooseEmoji(elOrigin),
            "change-note-choose-icon": (elOrigin) => this.contextMenuController.chooseIcon(elOrigin),
            "changeNoteIconContextMenu": (elOrigin, iconName, iconStyle) => this.contextMenuController.setIcon(elOrigin, iconName, iconStyle),
            "changeNoteEmojiContextMenu": (elOrigin, emoji) => this.contextMenuController.setEmoji(elOrigin, emoji)
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
        const configsWrapper = document.getElementById('configs-menu');
        const userMenuHeader = document.querySelector('.wrapper-user-menu-header');
        const configsContent = document.querySelectorAll('.configs-content-list');
        const warnModal = document.querySelectorAll('.modal-buttons');
        const searchWrapper = document.querySelector('.wrapper-search-content');
        const contextMenu = document.getElementById('context-menu');
        const changeNoteListEmojiIcon = document.querySelector('.wrapper-change-icons-emoji-list');

        changeNoteListEmojiIcon.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        contextMenu.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        userMenuHeader.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        searchWrapper.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        configsWrapper.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
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
        warnModal.forEach(wrapper => {

            wrapper.addEventListener('click', e => {

                this.clickHandle(e, actions);

            });

        });
        configsContent.forEach(wrapper => {

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

                handle(el, noteId);

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

            //console.log(notesModel);

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