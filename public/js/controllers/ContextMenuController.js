import { ContextMenuView } from "/js/view/context.menu.view.js";
import { IconsController } from '/js/controllers/iconsController.js';
import { EmojiController } from '/js/controllers/emojiController.js';

export class ContextMenuController{
    constructor(workspaceView, workspaceController, noteController){

        this.contextMenuEl = document.getElementById('context-menu');

        this.workspaceView = workspaceView;
        this.contextMenuView = new ContextMenuView();
        this.iconsController = new IconsController(document.getElementById('load-more-icons-in-change-note'), document.querySelector('.wrapper-icon-list-note-change'), 'changeNoteIconContextMenu');
        this.emojiController = new EmojiController(document.getElementById("load-more-icons-in-change-note"), document.querySelector('.wrapper-emoji-list-note-change'), 'changeNoteEmojiContextMenu');
        this.workspaceController = workspaceController;
        this.noteController = noteController;
        

        this.state = {
            id: null,
            note: null,
            type: null
        };

        this.startFilter();
        this.startImgEvent();

    }

    startFilter(){

        const filter = document.getElementById('change-note-icons-filter');

        filter.addEventListener('input', e=>{

            this.iconsController.setSearch(e.target.value.toLowerCase().trim());
            this.emojiController.setSearch(e.target.value.toLowerCase().trim());

        });

    }

    chooseEmoji(el){

        this.contextMenuView.showEmojiList();

        el.parentNode.children[0].classList.add('select');
        el.parentNode.children[2].classList.remove('select');

    }
    chooseIcon(el){

        this.contextMenuView.showIconList();

        el.parentNode.children[0].classList.remove('select');
        el.parentNode.children[2].classList.add('select');

    }

    setIcon(el, iconName, iconStyle){

        //console.log(iconName, iconStyle);

        this.contextMenuView.changeIcon(iconName, iconStyle);

        this.state.note.icon = `${iconStyle} ${iconName}`;
        this.state.note.emoji = '';

        //console.log(this.state);

    }
    setEmoji(el, emoji){

        //console.log(emoji);

        this.contextMenuView.changeEmoji(emoji);

        this.state.note.icon = '';
        this.state.note.emoji = emoji;

        //console.log(this.state);

    }

    renameNote(){

        this.state.type = 'rename';

        this.contextMenuView.showRename(this.state.note.title);

        this.updateModals();

    }
    newIconNote(){ //document.querySelector('.wrapper-icon-list-note-change')

        this.state.type = 'icon';

        this.state.oldIcon = this.state.note.icon?.length > 0 ?  this.state.note.icon : this.state.note.emoji;

        this.contextMenuView.showIcon(this.state.note.title, this.state.note.icon, this.state.note.emoji);

        this.updateModals();
    }

    updateModals(){

        this.workspaceView.showEl('#modal-warn');
        this.workspaceView.showEl('#change-note-wrapper');
        setTimeout(()=>this.workspaceView.unShowEl('#context-menu'), 1); // I use this because startEvents() is called about a millisecond before unShowEl() is executed, so it doesn't work.

    }

    newBackgroundNote(){

        this.state.type = 'background';

        //console.log(this.state);

        this.contextMenuView.showBackground(this.state.note.title, this.state.note.image);

        this.updateModals();

    }
    startImgEvent(){

        document.getElementById('change-note-image').addEventListener('change',
            e=>this.contextMenuView.renderImagePreview(e.target.files[0])
        );

    }
    calcelChange(){

        this.workspaceView.unShowEl('#modal-warn');
        this.workspaceView.unShowEl('#change-note-wrapper');

        this.contextMenuView.clear();

        this.iconsController.setSearch('');
        this.emojiController.setSearch('');
        this.state.oldIcon = '';

    }
    checkChange(){

        //console.log('Type of change: ', this.state.type);
        //console.log('Note: ', this.state.note);

        if(this.state.type === 'rename') this.alterName();

        if(this.state.type === 'icon') this.alterIcon();

        if(this.state.type === 'background') this.alterBackground();

    }

    startEvents(){
        
        document.addEventListener('click', e => {
            if(
                (
                    this.contextMenuEl.contains(e.target) &&
                    e.target.closest('.context-menu-item')
                ) || e.target.closest('button')?.dataset?.action === 'openContexMenu'
            ){
                
                this.workspaceView.showEl('#context-menu');

            }else{

                this.workspaceView.unShowEl('#context-menu');

            }
        });

    }

    openContextMenu(elOrigin, noteId){

        this.state.id = noteId;

        const noteInfo = this.workspaceController.getNoteById(this.state.id);

        console.log(noteInfo);

        this.state.note = {
            title: noteInfo.title,
            image: noteInfo.image,
            emoji: noteInfo.emoji,
            icon: noteInfo.icon
        };

        this.contextMenuEl.style.left = `${this.getLeft(elOrigin)}px`;
        this.contextMenuEl.style.top = `${this.getTop(elOrigin)}px`;

        this.checkOutside();

        this.startEvents();

    }
    getLeft(btn){

        let left = btn.getBoundingClientRect().right;

        //console.log('left: ', left);

        return left;

    }
    getTop(btn){

        let top = (btn.getBoundingClientRect().bottom) - ((this.contextMenuEl.getBoundingClientRect().height) + (btn.getBoundingClientRect().height));

        //console.log('top: ', top);

        return top;

    }
    checkOutside(){

        /*console.log('el: ----------------------------------------------------');
        console.log('top: ', this.contextMenuEl.getBoundingClientRect().top);
        console.log('bottom: ', this.contextMenuEl.getBoundingClientRect().bottom);
        console.log('right: ', this.contextMenuEl.getBoundingClientRect().right);
        console.log('left: ', this.contextMenuEl.getBoundingClientRect().left);
        console.log('end: ----------------------------------------------------');
        console.log('Client height: ', window.innerHeight);
        console.log('Client width: ', window.innerWidth);
        console.log('Menu height: ', this.contextMenuEl.getBoundingClientRect().height);
        console.log('Menu width: ', this.contextMenuEl.getBoundingClientRect().width);*/

        const top = this.contextMenuEl.getBoundingClientRect().top;
        const left = this.contextMenuEl.getBoundingClientRect().left;

        if(top < 0) this.contextMenuEl.style.top = `0px`;

        if((left + 50) + this.contextMenuEl.getBoundingClientRect().width  > window.innerWidth){
            this.contextMenuEl.style.left = '';
            this.contextMenuEl.style.right = '0';
        }
        //console.log((left + 50) + this.contextMenuEl.getBoundingClientRect().width  > window.innerWidth);

    }

    alterIcon(){

        if(this.state.note.icon === this.state.oldIcon){

            this.contextMenuView.logError('Please select a different icon.');
            return;

        }
        if(this.state.note.emoji === this.state.oldIcon){

            this.contextMenuView.logError('Please select a different emoji.');
            return;

        }
        if(!this.state.oldIcon){

            this.contextMenuView.logError('No changes detected.');
            return;

        }

        this.noteController.changeIcon(this.state.id, this.state.oldIcon, this.state.note.emoji, this.state.note.icon);

        this.calcelChange();

    }

    alterBackground(){

        const file = this.contextMenuView.noteImgInput.files[0];

        //console.log(file);
        //console.log(this.state);

        if(!file){
            this.contextMenuView.logError('Bsckground Cannot be empty');
            return;
        }

        this.noteController.changeBackground(this.state.id, file, this.state.note.image);

        this.calcelChange();

    }

    alterName(){

        const newTitle = this.contextMenuView.textInput.value;

        if(newTitle.trim().length < 1){
            this.contextMenuView.logError('Note Name Cannot be empty.');
            return;
        }
        if(newTitle.trim().length > 120){
            this.contextMenuView.logError('Note Name must be less than 120 caracteres.');
            return;
        }
        if(newTitle === this.state.note.title){
            this.contextMenuView.logError('The new name must not be the same as the current one.');
            return;
        }

        this.noteController.renameNote(this.state.id, newTitle);

        this.calcelChange();

    }

}