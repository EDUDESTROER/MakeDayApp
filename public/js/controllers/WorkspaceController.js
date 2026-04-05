import { WorkspaceView } from '/js/view/workspace.view.js';
import { CategoryController } from '/js/controllers/CategoryController.js';
import { CategoryModel } from '/js/models/CategoryModel.js';

export class WorkspaceController{

    constructor(){

        this._username;
        this.getUsername();
        this.startEvents();
        this.workspaceView = new WorkspaceView();
        this.categoryController = new CategoryController(this.workspaceView);
        this.categories = new Map();

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
            "showTarget": (elOrigin, elTarget) => this.openElement(elTarget),
            "returnTo": (elOrigin, elTarget) => this.checkState(elTarget),
            "createNote": (elOrigin, sheet, elTarget) => this.createNote(sheet, elTarget),
            "select-new-category": (elOrigin, typeTarget) => this.categoryController.changeBtnStyle(elOrigin),
            "createNewCategory": (elOrigin) => this.createNewCategory(elOrigin),
        };

        const wrapperHeader = document.querySelector('.wrapper-header');
        const bottomBar = document.querySelector('.bottom-bar-wrapper');
        const wrapperCategoryStyle = document.querySelector('.new-category-styles');
        const wrappersSubmitNew = document.querySelectorAll('.wrapper-submit-new');


        wrapperHeader.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        bottomBar.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        wrapperCategoryStyle.addEventListener('click', e=>{

            this.clickHandle(e, actions);

        });
        wrappersSubmitNew.forEach(wrapper=>{

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
        const sheet = el.dataset.sheet;

        //console.log(actions);

        const handle = actions[action];

        if(target && !sheet){
                
            if(handle){

                handle(el, target);

            }

        }else if(target && sheet){
                
            if(handle){

                handle(el, sheet, target);

            }

        }else{

            actions[action]?.(el);

        }

    }

    createNote(sheet, target){

        this.openElement(target);

    }
    async createNewCategory(clickBtn){

        clickBtn.disabled = true;

        try{

            const categoryData = await this.categoryController.create();

            //console.log(category);

            const categoryModel = new CategoryModel(categoryData);

            this.categories.set(categoryModel.id, categoryModel);

            //this.categories = category.map(cat => new CategoryModel(cat));

            console.log(this.categories);

            // Send to view 
            this.categoryController.render(categoryModel);

        }catch(error){

            this.categoryController.error('Create error', error); // temporary

        }finally{

            clickBtn.disabled = false;

        }

    }

    openElement(target){

        this.workspaceView.flowControl(target);

    }
    
}