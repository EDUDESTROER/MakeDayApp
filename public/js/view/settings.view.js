export class SettingsView{

    constructor(workspaceView){

        this.sections = [];
        this.selectedConfig = 'general';
        this.sectionIcon = {
            'account': 'fa-regular fa-user',
            'general': 'fa-solid fa-gear'
        };
        this.sectionsWrapper = document.querySelector('.left-bar-configs-menu');
        this.configsContentWrapper = document.getElementById('configs-content');
        this.workspaceView = workspaceView;

    }

    
    changeSubMenu(id, el){

        if(!this.workspaceView.wideScreen){
            
            this.workspaceView.unShowEl(`#left-bar-configs-menu`);

            this.workspaceView.showEl(`#configs-content`)

        }

        el.classList.add('select-config');

        document.getElementById(`configuration-list-item-${this.selectedConfig}`).classList.remove('select-config');

        this.workspaceView.unShowEl(`#wrapper-configs-content-sub-menu-${this.selectedConfig}`);

        const wrapper = document.getElementById(id);

        this.selectedConfig = wrapper.dataset.section;

        this.workspaceView.showEl(`#${id}`);

    }
    showBtnSubMenu(id){

        const select = document.getElementById(id);

        if(select.style.opacity !== '0'){

            this.workspaceView.unShowEl(`#${id}`);

        }else{

            this.workspaceView.showEl(`#${id}`);

        }

        

    }

    assembler(setting){

        if(!this.sections.includes(setting.section)) this.assemblerSection(setting.section);

        if(setting.type === 'button') this.assembleInteractBtn(setting);
        if(setting.type === 'select') this.assembleInteractList(setting);
        

    }
    assembleInteractList(setting){

        const contentTitle = this.createContentTitle(setting.key);

        const selectElement = this.createListWrapper(
            setting.value,
            setting.options,
            setting.action,
            setting.key
        );

        const wrapper = document.createElement('div');

        wrapper.className = 'configs-content-wrapper';

        wrapper.append(contentTitle, selectElement);

        const parent = document.getElementById(`configs-content-list-${setting.section}`);

        parent.appendChild(wrapper);

    }
    createListWrapper(value, options, action, key){

        const listHeader = this.createListHeader(value, key);

        const listWrapper = this.createTypeListWrapper(options, action, value, key);

        const parent = document.createElement('div');

        parent.className = 'configs-content-select';

        parent.append(listHeader, listWrapper);

        return parent;

    }
    createTypeListWrapper(options, action, selectOption, id){

        const wrapper = document.createElement('div');

        wrapper.className = 'type-list'
        wrapper.style.opacity = '0';
        wrapper.setAttribute('inert', '');

        wrapper.id = `sub-menu-configs-${id}`;

        options.forEach(option=>{

            const span = this.createSpan(option);

            span.className = 'list-item list-style';

            span.dataset.action = action;
            span.dataset.to = option;

            if(option === selectOption) span.classList.add('select-item');

            wrapper.appendChild(span);

        });

        return wrapper;

    }
    createListHeader(txtContent, open){

        const span = this.createSpan(txtContent.charAt(0).toUpperCase() + txtContent.slice(1));
        const i = this.createIconEl('fa-solid fa-angle-down');

        const header = document.createElement('div');

        header.className = 'list-header list-style';

        header.dataset.action = 'ShowSubMenu';
        header.dataset.target = `sub-menu-configs-${open}`;

        header.append(span, i);

        return header;

    }
    assembleInteractBtn(setting){

        const selectElement = this.assemblerBtnWrappper(
            setting.btnTitle,
            setting.icon,
            setting.action
        );

        const contentTitle = this.createContentTitle(setting.key);

        const wrapper = document.createElement('div');

        wrapper.className = 'configs-content-wrapper';

        wrapper.append(contentTitle, selectElement);

        const parent = document.getElementById(`configs-content-list-${setting.section}`);

        parent.appendChild(wrapper);

    }

    createContentTitle(key){

        const wrapper = document.createElement('div');

        wrapper.className = 'configs-content-title';

        wrapper.textContent = key.charAt(0).toUpperCase() + key.slice(1);

        return wrapper;

    }

    assemblerBtnWrappper(title, icon, action){

        const span = this.createSpan(title.charAt(0).toUpperCase() + title.slice(1));

        const iconEl = this.createIconEl(icon);

        const btn = document.createElement('button');

        btn.className = 'buttuns-purple-style';
        btn.type = 'button';
        btn.dataset.action = action;

        btn.append(span, iconEl);

        const div = document.createElement('div');
        
        div.className = 'type-button'

        div.appendChild(btn);

        const wrapper = document.createElement('div');

        wrapper.className = 'configs-content-select';

        wrapper.appendChild(div);

        return wrapper;

    }

    assemblerHeader(sectionName){

        const span = document.createElement('span');

        span.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

        const header = document.createElement('div');

        header.className = 'configs-content-header';

        header.appendChild(span);

        return header;

    }

    assemblerSection(sectionName){

        this.sections.push(sectionName);

        const icon = this.sectionIcon[sectionName];

        const formatedTxt = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

        const title = this.createSpan(formatedTxt);

        const iconEl = this.createIconEl(icon);

        const div = this.createSectionDiv(sectionName);

        div.append(iconEl, title);

        this.sectionsWrapper.appendChild(div);

        this.assemblerSectionWrapper(sectionName);

    }
    assemblerSectionWrapper(name){

        const header = this.assemblerHeader(name);

        const content = this.assemblerContent(name);

        const wrapper = document.createElement('div');

        wrapper.className = 'wrapper-configs-content-type';

        wrapper.id = `wrapper-configs-content-sub-menu-${name}`;
        wrapper.dataset.section = name;

        wrapper.append(header, content);

        this.configsContentWrapper.appendChild(wrapper);

        if(!(name === this.selectedConfig)){

            wrapper.style.opacity = '0';
            wrapper.setAttribute('inert', '');

        }

    }

    assemblerContent(sectionName){

        const div = document.createElement('div');

        div.className = 'configs-content-list';

        div.id = `configs-content-list-${sectionName}`;

        return div;

    }

    createSectionDiv(name){

        const div = document.createElement('div');

        div.className = 'list-style configuration-list-item';

        if(name === this.selectedConfig){
            div.classList.add('select-config')
            div.style.order = "-1";
        }

        div.dataset.action = 'changeSubMenu';
        div.dataset.target = `wrapper-configs-content-sub-menu-${name}`;

        div.id = `configuration-list-item-${name}`;

        return div;

    }

    createIconEl(iconName){

        const iEl = document.createElement('i');

        iEl.className = iconName;

        return iEl;

    }

    createSpan(txt){

        const span = document.createElement('span');

        span.textContent = txt;

        return span;

    }

}