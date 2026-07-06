export class SearchView{

    constructor(){

        this.errorLog = document.getElementById('search-error');
        this.searchWrapper = document.querySelector('.wrapper-search-content');
        this.emptyStateEl = document.getElementById('search-empty-state');

    }

    logError(errorTxt){

        this.errorLog.textContent = errorTxt

        setTimeout(()=>this.clearnError(), 10000);

    }

    clearnError(){

        this.errorLog.textContent = '';

    }
    renderNotesWithTitle(notesArray){

        //console.log(notesArray);

        if(notesArray.length < 1) return;

        const wrapper = this.createWrapper('search-title-notes search-notes');

        const title = this.createTitle('search-title-style', 'All Notes');

        wrapper.appendChild(title);

        notesArray.forEach(obj=>{

            wrapper.appendChild(this.assembleNote(obj));

        });

        this.searchWrapper.appendChild(wrapper);

    }
    renderNotesWithContent(notesArray, term){

        if(notesArray.length < 1) return;

        const wrapper = this.createWrapper('search-title-note-content search-notes');

        const title = this.createTitle('search-title-style', 'All Notes Content');

        wrapper.appendChild(title);

        notesArray.forEach(obj=>{

            wrapper.appendChild(this.assembleNoteContent(obj, term));

        });

        this.searchWrapper.appendChild(wrapper);

    }
    assembleNoteContent(note, term){

        const wrapper = this.createNoteWrapper(note.id, 'search-wrapper-note-content list-style basic-list');

        const iconWrapper = this.createIconWrapper(note.icon, note.emoji);

        const span = this.createSpan(note.title);

        const selectSearch = this.assemblerSearchEl(note.search_content, term);

        wrapper.append(iconWrapper, span, selectSearch);

        return wrapper;

    }
    assemblerSearchEl(text, term){

        const p = document.createElement('p');

        p.className = 'search-text-content';

        const lowerText = text.toLowerCase();
        const lowerTerm = term.toLowerCase();

        const index = lowerText.indexOf(lowerTerm);

        if(index === -1){

            p.textContent = text;
            return p;

        }

        //text before
        p.append(document.createTextNode(text.slice(0, index)));

        const termEl = document.createElement('span');

        termEl.className = 'selected-search-content';

        termEl.textContent = text.slice(index, index + term.length);

        //console.log(index, term.length + 1);

        p.append(termEl);

        //text after

        p.append(document.createTextNode(text.slice(index + term.length)));

        return p;

    }
    createSpan(title){

        const span = document.createElement('span');

        span.className = 'list-text';

        span.textContent = title;

        return span;

    }
    renderConfigs(configsArray){

        //console.log(configsArray);

        if(configsArray.length < 1) return;

        const wrapper = this.createWrapper('search-title-settings search-notes');

        const title = this.createTitle('search-title-style', 'All Settings');

        wrapper.appendChild(title);

        configsArray.forEach(obj=>{

            //console.log(obj);

            wrapper.appendChild(this.assembleSetting(obj));

        });

        this.searchWrapper.appendChild(wrapper);
        
    }
    assembleSetting(settingObj){

        const wrapper = this.createSettingsWrapper();

        const title = this.createTitle('configs-content-title', settingObj.key);

        const content = this.createSettingsContent(settingObj);

        wrapper.append(title, content);

        return wrapper;

    }
    createSettingsContent(settingObj){

        const wrapper = document.createElement('div');

        wrapper.className = 'configs-content-select';

        if(settingObj.type === 'button'){

            wrapper.appendChild(this.createSettingButtonWrapper(settingObj.action, settingObj.btnTitle, settingObj.icon));

        }else if(settingObj.type === 'select'){

            const listHeader = this.assemblerHeader(settingObj.key, settingObj.value);

            const subMenu = this.assemblerSubmenu(settingObj.options, settingObj.key, settingObj.action, settingObj.value);

            wrapper.append(listHeader, subMenu);

        }

        return wrapper;

    }
    assemblerSubmenu(options, key, action, value){

        const wrapper = this.createWrapperSubMenu(key);

        options.forEach(option => {

            wrapper.appendChild(this.getOptionEl(option, action, value));

        });

        return wrapper;

    }
    getOptionEl(option, action, value){

        const span = document.createElement('span');

        span.className = 'list-item list-style';
        span.dataset.action = action;
        span.dataset.to = option;

        if(option === value) span.classList.add('select-item');

        span.textContent = option;

        return span;

    }
    createWrapperSubMenu(key){

        const wrapper = document.createElement('div');

        wrapper.className = 'type-list';

        wrapper.setAttribute('inert', '');

        wrapper.id = `sub-menu-configs-${key}-search`;

        wrapper.style.opacity = '0';

        return wrapper;


    }
    assemblerHeader(key, value){

        const wrapper = document.createElement('div');

        wrapper.className = 'list-header list-style';
        wrapper.dataset.action = 'ShowSubMenu';
        wrapper.dataset.target = `sub-menu-configs-${key}-search`;

        const span = document.createElement('span');

        span.textContent = key;

        const i = document.createElement('i');

        i.className = 'fa-solid fa-angle-down';

        wrapper.append(span, i);

        return wrapper;

    }
    createSettingButtonWrapper(action, title, icon){

        const wrapper = document.createElement('div');

        wrapper.className = 'type-button';

        const btn = this.getButton(action);

        const span = document.createElement('span');

        span.textContent = title;

        const i = document.createElement('i');

        i.className = icon;

        btn.append(span, i)

        wrapper.appendChild(btn);

        return wrapper;

    }
    getButton(action){

        const button = document.createElement('button');

        button.type = 'button';

        button.className = 'buttuns-purple-style';

        button.dataset.action = action;

        return button;

    }
    createSettingsWrapper(){

        const div = document.createElement('div');

        div.className = 'configs-content-wrapper';

        return div;

    }
    createWrapper(elClass){

        const div = document.createElement('div');

        div.className = elClass;


        return div;


    }
    createTitle(elClass, elContent){

        const title = document.createElement('span');

        title.className = elClass;
        title.textContent = elContent;

        return title;

    }

    assembleNote(note){

        const noteWrapper = this.createNoteWrapper(note.id, 'list-style basic-list');

        const iconWrapper = this.createIconWrapper(note.icon, note.emoji);

        const titleWrapper = this.createTitleWrapper(note.title);

        const btn = this.createContextMenuBtn(note.id);

        noteWrapper.append(iconWrapper, titleWrapper, btn);

        return noteWrapper;

    }
    createNoteWrapper(id, elClass){

        const el = document.createElement('div');

        el.className = elClass;

        el.dataset.action = 'openNote';
        el.dataset.noteId = id;

        return el;

    }
    createIconWrapper(icon, emoji){

        const wrapper = document.createElement('div');

        wrapper.className = 'basic-icon-list';

        const i = document.createElement('i');

        if(icon.length > 0){

            i.className = icon;

        }else if(emoji.length > 0){

            i.textContent = emoji

        }

        wrapper.appendChild(i);

        return wrapper;

    }
    createTitleWrapper(title){

        const wrapper = document.createElement('h3');

        wrapper.className = 'list-text';

        wrapper.textContent = title;

        return wrapper;

    }
    createContextMenuBtn(id){

        const btn = document.createElement('button');

        btn.type = 'button';

        btn.className = 'buttons-basic-efects';

        btn.dataset.action = 'openContexMenu';
        btn.dataset.noteId = id;

        const i = document.createElement('i');

        i.className = 'fa-solid fa-ellipsis';

        btn.appendChild(i);

        return btn;

    }
    showEmptyState(term){

        this.emptyStateEl.style.display = 'block';

        const termEl = document.getElementById('search-empty-state-term');

        termEl.textContent = `for "${term}"`;

    }
    hideEmptyState(){

        this.emptyStateEl.style.display = 'none'

    }

}