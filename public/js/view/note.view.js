export class NoteView{

    constructor(workspaceView){

        this.workspaceView = workspaceView;
        this.previewsTitles = document.querySelectorAll('.note-result-title');
        this.newNoteResultIcons = document.querySelectorAll('.new-note-result-icon');
        this.chooseImageWrapper = document.querySelector('#wrapper-new-note-choose-image-wrapper');
        this.wrappersResult = {
            'card': document.querySelector('#wrapper-note-result-card'),
            'list': document.querySelector('#wrapper-note-result-list')
        }
        this.selectResult = 'card';

        this.inputImageResult = document.querySelector('#new-note-image-accept');
        this.inputImageName = document.querySelector('#new-note-image-name');
        this.newNoteResultImageTag = document.querySelector('.new-note-result-image');
        this.newNoteErrorImage = document.querySelector('#create-new-note-error-image');
        this.allTasksEl = document.querySelector('.all-tasks-content-wrapper');
        this.noteTitleEl = document.querySelector('#note-title');
        this.noteIconEl = document.querySelector('#note-icon');
        this.noteImageEl = document.querySelector('#note-image');
        this.noteImageWrapperEl = document.querySelector('#note-image-wrapper');
        this.noteIconWrapperEl = document.querySelector('#note-icon-wrapper');

    }

    setInAllNote(title, icon, emoji, image){

        /*console.log('Render note page: ');
        console.log('Note Title: ', title);
        console.log('Note icon: ', icon);
        console.log('Note emoji: ', emoji);
        console.log('Note image: ', image);*/

        if(!image){
            
            this.workspaceView.unShowEl(`#${this.noteImageWrapperEl.id}`);
            this.noteImageWrapperEl.style.position = 'absolute';
            this.noteIconWrapperEl.style.marginTop = '1rem';

        }else{

            this.workspaceView.showEl(`#${this.noteImageWrapperEl.id}`);
            this.noteImageWrapperEl.style.position = 'static';
            this.noteIconWrapperEl.style.marginTop = '-1rem';

            this.noteImageEl.src = `/uploads/attachments/${image}`;

        }

        if((!icon && !emoji) || !title) throw new Error('Invalid note.');

        this.noteTitleEl.textContent = title;
        if(!icon){
            this.noteIconEl.className = '';
            this.noteIconEl.textContent = emoji;
        }else{
            this.noteIconEl.className = icon;
            this.noteIconEl.textContent = '';
        }
        

    }

    updateNotePreviewTitle(value){

        this.previewsTitles.forEach(el => {
            el.textContent = value;
        });

    }
    updateNotePreviewImage(file){

        try{

            if(!file || file === '') return;

            const reader = new FileReader();

            reader.onload = (event) => {
                this.newNoteResultImageTag.src = event.target.result;
            }

            reader.onerror = (error) => {

                throw new Error(error);

            }

            this.inputImageName.textContent = file.name;

            reader.readAsDataURL(file);

            this.inputImageSucess();

        }catch(err){

            this.setError(0, err, this.newNoteErrorImage);

        }

    }
    resetPreviewImage(){

        this.newNoteResultImageTag.src = `/uploads/attachments/default.jpg`;
        this.inputImageName.textContent = `image-name.jpg`;
        this.inputImageSucess();

    }
    updateNotePreviewIcon(value){

        //console.log(value);

        this.newNoteResultIcons.forEach(el =>{
            el.textContent = '';
            el.className = value;
            //console.log(el);
        });

    }
    updateNotePreviewEmoji(value){

        this.newNoteResultIcons.forEach(el =>{
            el.textContent = value;
            el.className = '';
        });

    }

    inputImageSucess(){

        this.inputImageResult.style.background = '#00942E'
        this.inputImageResult.style.background = 'linear-gradient(0deg, #00942E 10%, #00A634 100%)';
            this.inputImageResult.style.background = '-webkit-linear-gradient(0deg, #00942E 10%, #00A634 100%)';

        setTimeout(()=>{

            this.inputImageResult.style.background = '#470094';
            this.inputImageResult.style.background = 'linear-gradient(0deg, #470094 10%, #6b00e0 100%)';
            this.inputImageResult.style.background = '-webkit-linear-gradient(0deg, #470094 10%, #6b00e0 100%)';

        }, 5000);

    }

    showChooseImageWrapper(type){

        if(type === 'card'){
            this.chooseImageWrapper.style.position = 'static';
            this.workspaceView.showEl(`#${this.chooseImageWrapper.id}`);
        }else{
            this.chooseImageWrapper.style.position = 'absolute';
            this.workspaceView.unShowEl(`#${this.chooseImageWrapper.id}`);
        }

    }

    removeEmptyState(parent){

        if(parent.dataset.emptyState){

            const child = document.getElementById(parent.dataset.emptyState);

            //console.log(child);

            if(child) parent.removeChild(child);

        }

    }

    renderNote(note, renderType){

        //console.log('Creating a new note: ', note, renderType);

        if(renderType === 'card'){

            const newNote = this.assembleCard(note.icon, note.emoji, note.image, note.title, note.id);

            if(!note.parentId){

                this.removeEmptyState(this.allTasksEl);

                this.allTasksEl.appendChild(newNote);

            }else if(note.parentId){

                const parentEl = document.getElementById(note.parentId);

                this.removeEmptyState(parentEl);

                parentEl.appendChild(newNote);

            }

            //console.log(newNote);

        }else if(renderType === 'list'){

            const newNote = this.assembleList(note.icon, note.emoji, note.title, note.id);

            if(!note.parentId){

                this.removeEmptyState(this.allTasksEl);

                this.allTasksEl.appendChild(newNote);

            }else if(note.parentId){

                const parentEl = document.getElementById(note.parentId);

                this.removeEmptyState(parentEl);

                parentEl.appendChild(newNote);

            }

            //console.log(newNote);

        }else{

            return new Error("Error rendering note.");

        }
        
    }

    renderFavoritesView(note){

        const newNote = this.assembleCard(note.icon, note.emoji, note.image, note.title, note.id);

        const parentEl = document.getElementById('favorites-content');

        parentEl.appendChild(newNote);

        this.showFavoritesWrapper();

    }

    showFavoritesWrapper(){

        const wrapper = document.getElementById('favorites-wrapper');

        wrapper.style.position = 'static';

        this.workspaceView.showEl(`#${wrapper.id}`);

    }

    assembleList(icon, emoji, title, id){

        const noteIcon = this.createIcon(icon, emoji);
        const menuIcon = this.createIcon('fa-solid fa-ellipsis');
        const wrapperIcon = this.createDiv('basic-icon-list');
        const header = this.createHeader('list-text', title);
        const menuButton = this.createBtn('buttons-basic-efects', 'button', 'openContexMenu', id);

        wrapperIcon.appendChild(noteIcon);

        menuButton.appendChild(menuIcon);

        const newNote = this.createDiv('list-style basic-list', id, 'openNote');

        newNote.append(wrapperIcon, header, menuButton);

        return newNote;

    }

    assembleCard(icon, emoji, image, title, id){

        const iconEl = this.createIcon(icon, emoji);

        const internDiv = this.createDiv('card-icon');

        internDiv.appendChild(iconEl);

        if(!image) image = 'default.jpg';

        const img = this.createImgTag('card-background', `uploads/attachments/${image}`, `${title} background image.`);

        const header = this.createHeader('card-text', title);

        const wrapperDiv = this.createDiv('card-square list-style', id, 'openNote');

        wrapperDiv.append(internDiv, img, header);

        return wrapperDiv;

    }

    createBtn(btnClass, btnType, btnDataAction, btnDataId){

        const btn = document.createElement('button');

        btn.className = btnClass;
        btn.type = btnType;

        if(btnDataAction) btn.dataset.action = btnDataAction;
        if(btnDataId) btn.dataset.noteId = btnDataId;

        return btn;

    }

    createImgTag(imgClass, imgSrc, imgAlt){

        const imgTag = document.createElement('img');

        imgTag.className = imgClass;
        imgTag.src = imgSrc;
        imgTag.alt = imgAlt;

        return imgTag;

    }

    createHeader(headerClass, headerContent){

        const header = document.createElement('h3');

        header.className = headerClass;

        header.textContent = headerContent;

        return header;

    }

    createIcon(iconClass, emoji){

        const i = document.createElement('i');

        if(!iconClass || iconClass === undefined){
            i.textContent = emoji;
        }else{
            i.className = iconClass;
        }

        return i;

    }

    cleanElementChilds(el){

        el.replaceChildren();

    }

    updateNoteTitleInCategories(id, title){

        const notesEl = document.querySelectorAll(`[data-note-id="${id}"]`);

        //console.log(notesEl);

        notesEl.forEach(el=>{

            const titleEl = el.querySelector('.list-text');
            const cardEl = el.querySelector('.card-text');
            const smartTitle = el.querySelector('.wrapper-smart-title');

            /*console.log(titleEl);
            console.log(cardEl);
            console.log(smartTitle);*/

            if(titleEl) titleEl.textContent = title;

            if(cardEl) cardEl.textContent = title;

            if(smartTitle) smartTitle.textContent = title;

        });

    }
    updateIconInCategories(id, icon, emoji){

        const notesEl = document.querySelectorAll(`[data-note-id="${id}"]`);

        //console.log(notesEl);

        notesEl.forEach(el=>{

            const i = document.createElement('i');

            if(icon){

                i.className = icon;

            }
            if(emoji){

                i.textContent = emoji;

            }

            const iconWrapper = el.querySelector('.basic-icon-list');
            const smartIcon = el.querySelector('.wrapper-smart-icon');
            const cardIcon = el.querySelector('.card-icon');

            /*console.log(iconWrapper);
            console.log(smartIcon);
            console.log(cardIcon);*/

            if(iconWrapper) {

                iconWrapper.replaceChildren();
                iconWrapper.appendChild(i);

            }

            if(smartIcon) {

                smartIcon.replaceChildren();
                smartIcon.appendChild(i);

            }

            if(cardIcon){

                cardIcon.replaceChildren();
                cardIcon.appendChild(i);

            }

        });

    }

    updateCategoriesCard(id, image){

        const notesEl = document.querySelectorAll(`[data-note-id="${id}"]`);

        notesEl.forEach(el=>{

            const cardImage = el.querySelector('.card-background');

            if(cardImage) cardImage.src = `uploads/attachments/${image}`;

        });

    }

    createDiv(divClass, dataId, dataAction){

        const div = document.createElement('div');

        div.className = divClass;

        if(dataId) div.dataset.noteId = dataId;
        if(dataAction) div.dataset.action = dataAction;

        return div;

    }

    showResult(type){

        let oldSelectEl = this.wrappersResult[this.selectResult];

        //console.log(oldSelectEl.id, type);

        this.workspaceView.unShowEl(`#${oldSelectEl.id}`);

        oldSelectEl.style.position = 'absolute';

        let newSelectEl = this.wrappersResult[type];

        this.workspaceView.showEl(`#${newSelectEl.id}`);

        newSelectEl.style.position = 'static';

        this.selectResult = type;



    }
    setError(gravity, error, el){

        if(gravity === 0){

            el.textContent === error;

            setTimeout(()=>{
                el.textContent === '';
            }, 10000);

        }

    }

}