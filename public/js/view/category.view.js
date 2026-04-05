export class CategoryView{

    constructor(){

        this.categoriesWrapper = document.querySelector('#left-side-bar');

    }

    updateCategoryPreview(value){

        let previewTitles = document.querySelectorAll('.category-result-title');

        previewTitles.forEach(title => {

            title.textContent = value;

        });

    }

    renderCategory(category){

        //console.log('Creating a new categorie: ', category);

        const categoryEl = this.assembleCategory(category.id, category.title, category.viewMode);

        this.categoriesWrapper.appendChild(categoryEl);
        
    }

    assembleCategory(id, title, viewMode){

        let contentWrapper = this.createCategoryContentWrapper(viewMode);

        let h2 = this.createCategoryTitle(title, id);

        let categoryWrapper = this.createCategoryWrapper(viewMode);

        categoryWrapper.append(h2, contentWrapper);

        return categoryWrapper;

    }

    createCategoryContentWrapper(viewMode){

        let wrapper = document.createElement('div');

        wrapper.classList.add('basic-content');

        if(viewMode === 'card'){
            wrapper.classList.add('wrapper-Card');
        }else{
            wrapper.classList.add('list-content-wrapper');
        }

        return wrapper;

    }

    createCategoryWrapper(viewMode){

        let wrapper = document.createElement('div');

        wrapper.classList.add('side-wrappers');

        if(viewMode === 'card'){
            wrapper.classList.add('wrapper-Card');
        }else{
            wrapper.classList.add('wrapper-list');
        }

        return wrapper;

    }

    createCategoryTitle(title, id){

        let h2 = document.createElement('h2');
        let button = document.createElement('button');
        let icon = document.createElement('i');

        icon.classList.add('fa-solid', 'fa-square-plus');

        button.type = 'button';
        button.title = `Create a new note in ${title} category`;
        button.classList.add("buttuns-purple-style");
        button.dataset.action = 'createNoteIn';
        button.dataset.categoryId = id;

        button.appendChild(icon);

        h2.textContent = title;

        h2.appendChild(button);

        return h2;

    }

}