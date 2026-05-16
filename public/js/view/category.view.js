export class CategoryView{

    constructor(){

        this.categoriesWrapper = document.querySelector('#left-side-bar');
        this.previewTitles = document.querySelectorAll('.category-result-title');

    }

    emptyStateTo(id){

        const contentWrapper = document.getElementById(id);

        const emptyId = `category-empty-state-${id}`;

        contentWrapper.dataset.emptyState = emptyId;

        const p = document.createElement('p');

        p.textContent = 'This category is empty';

        const button = this.createEmptyStateButton(id);

        const wrapper = this.createEmptyStateWrapper(emptyId);

        wrapper.append(p, button);

        contentWrapper.appendChild(wrapper);

    }

    createEmptyStateButton(id){

        const span = document.createElement('span');

        span.textContent = 'Create a note';

        const i = document.createElement('i');

        i.className = 'fa-solid fa-plus';

        const button = document.createElement('button');

        button.dataset.action = 'createNote';
        button.dataset.target = '#new-note';
        button.dataset.parentId = id !== 'all-tasks-content-wrapper' ? id : 'all-notes';

        button.className = 'buttuns-purple-style';

        button.append(span, i);

        return button;

    }

    createEmptyStateWrapper(id){

        const wrapper = document.createElement('div');

        wrapper.className = 'wrapper-category-empty-state';

        wrapper.id = id;

        return wrapper;

    }

    updateCategoryPreview(value){

        this.previewTitles.forEach(title => {

            title.textContent = value;

        });

    }

    renderCategory(category){

        //console.log('Creating a new categorie: ', category);

        const categoryEl = this.assembleCategory(category.id, category.title, category.viewMode);

        this.categoriesWrapper.appendChild(categoryEl);

        this.emptyStateTo(category.id);
        
    }

    assembleCategory(id, title, viewMode){

        let contentWrapper = this.createCategoryContentWrapper(viewMode, id);

        let h2 = this.createCategoryTitle(title, id);

        let categoryWrapper = this.createCategoryWrapper(viewMode);

        categoryWrapper.append(h2, contentWrapper);

        return categoryWrapper;

    }

    createCategoryContentWrapper(viewMode, id){

        let wrapper = document.createElement('div');

        wrapper.id = id;

        if(viewMode === 'card'){
            wrapper.classList.add('wrapper-card-content');
        }else{
            wrapper.classList.add('basic-content');
            wrapper.classList.add('list-content-wrapper');
        }
        wrapper.style.position = 'relative';

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
        button.dataset.target = '#new-note';
        button.dataset.action = 'createNote';
        button.dataset.parentId = id;

        button.appendChild(icon);

        h2.textContent = title;

        h2.appendChild(button);

        return h2;

    }

}