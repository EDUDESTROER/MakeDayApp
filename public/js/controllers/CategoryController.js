import { CategoryView } from "/js/view/category.view.js";

export class CategoryController{

    constructor(workspaceView){

        this.workspaceView = workspaceView;
        this.categoryView = new CategoryView;

        this.state = {
            title: '',
            viewMode: 'card'
        };

        this.inputNewTitle = document.querySelector('#input-new-category-name');

        this.stylesWrappers = {
            'Card': document.querySelector('#new-category-style-card'),
            'List': document.querySelector('#new-category-style-list')
        }

        this.focusWrapper = 'Card';

        this.initEvents();
    }

    initEvents(){

        this.inputNewTitle.addEventListener('input', e => {

            this.setTitle(e.target.value);

        });

    }

    setTitle(value){

        this.state.title = value.trim();
        this.updatePreview();

    }
    updatePreview(){

        this.categoryView.updateCategoryPreview(
            this.state.title || 'Category Name'
        );

    }

    changeBtnStyle(targetBtn){

        this.toggleStyles(
            targetBtn.dataset.categoryStyle
        );

        const buttons = targetBtn.parentElement.children;

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

    async create(){

        if(!this.state.title){

            throw new Error('Category name cannot be empty.');

        }

        const response = await fetch('/categories', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.title,
                viewMode: this.state.viewMode,
                parentId: null
            })
        });

        if(!response.ok) throw new Error('Failed to create category');

        return await response.json();

    }

    render(category){

        this.categoryView.renderCategory(category);
        this.categoryReset();

    }
    categoryReset(){

        this.state.title = '';
        this.state.viewMode = 'card';

        this.updatePreview();
        this.toggleStyles('Card');
        this.inputNewTitle.value = '';


    }

    error(where, error){

        let log = '';
        
        if(where === 'Create error'){

            log = '#create-new-category-error';

            this.workspaceView.errorLog(log, error);

            this.inputNewTitle.classList.add('input-error');

            setTimeout(()=>{
                this.workspaceView.errorLog(log, '');
                this.inputNewTitle.classList.remove('input-error');
            },5000);

        }
        

    }

}