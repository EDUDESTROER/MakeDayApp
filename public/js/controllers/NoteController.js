import {WorkspaceView} from '/js/view/workspace.view.js'

export class NoteController{

    constructor(){

        this._username;
        this.getUsername();
        this.startEvents();
        this.workspaceView = new WorkspaceView();

    }

    async getUsername(){

        const res = await fetch('/me');
        const user = await res.json();

        this._username =  user.username;

        this.setInfo();

    }

    setInfo(){

        document.getElementById('username').textContent = this._username;

    }

    startEvents(){

        const actions = {
            "showTarget": (elTarget) => this.openElement(elTarget),
            "returnTo": (elTarget) => this.checkState(elTarget),
            "createNote": (sheet, elTarget) => this.createNote(sheet, elTarget)
        };

        const wrapperHeader = document.querySelector('.wrapper-header');
        const bottomBar = document.querySelector('.bottom-bar-wrapper');

        wrapperHeader.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        bottomBar.addEventListener('click', e=>{

            this.clickHandle(e, actions);

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
        const sheet = el.dataset.sheet;

        //console.log(action);
        //console.log(actions);

        const handle = actions[action];

        if(target && !sheet){
                
            if(handle){

                handle(target);

            }

        }else if(target && sheet){
                
            if(handle){

                handle(sheet, target);

            }

        }else{

            actions[action]?.();

        }

    }

    createNote(sheet, target){

        this.openElement(target);

    }

    openElement(target){

        this.workspaceView.flowControl(target);

    }
}