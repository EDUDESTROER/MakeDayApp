import { ContextMenuView } from "/js/view/context.menu.view.js";

export class ContextMenuController{
    constructor(workspaceView, workspaceController, noteController){

        this.contextMenuEl = document.getElementById('context-menu');

        this.workspaceView = workspaceView;
        this.contextMenuView = new ContextMenuView();
        this.workspaceController = workspaceController;
        this.noteController = noteController;
        

        this.state = {
            id: null,
            note: null,
            type: null
        };

    }

    renameNote(){

        this.state.type = 'rename';

        this.contextMenuView.showRename(this.state.note.title);

        this.workspaceView.showEl('#modal-warn');
        this.workspaceView.showEl('#change-note-wrapper');
        setTimeout(()=>this.workspaceView.unShowEl('#context-menu'), 1); // I use this because startEvents() is called about a millisecond before unShowEl() is executed, so it doesn't work.

    }
    calcelChange(){

        this.workspaceView.unShowEl('#modal-warn');
        this.workspaceView.unShowEl('#change-note-wrapper');

        this.contextMenuView.clear();

    }
    checkChange(){

        //console.log('Type of change: ', this.state.type);
        //console.log('Note: ', this.state.note);

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

        if(this.state.type === 'rename'){

            this.noteController.renameNote(this.state.id, newTitle);

            this.calcelChange();

        }

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

}