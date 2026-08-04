export class ContextMenuView{

    constructor(){

        this.titleEl = document.getElementById('change-note-title');
        this.resultImg = document.getElementById('wrapper-change-note-result-background');
        this.imgInfo = document.getElementById('change-note-img-info');
        this.iconWrapper = document.getElementById('wrapper-icon-list-change');

        this.textInput = document.getElementById('change-note-input');
        this.deleteInput = document.getElementById('delete-note-password-input');

        this.imgResultEl = document.getElementById('change-note-result-background');
        this.imgNameEl = document.getElementById('change-note-image-name');
        this.noteImgInput = document.getElementById('change-note-image');

        this.iconChangeEl = document.getElementById('change-note-icon-el');

        this.iconListEl = document.querySelector('.wrapper-icon-list-note-change');
        this.emojiListEl = document.querySelector('.wrapper-emoji-list-note-change');

        this.changeImageAccept = document.getElementById('change-note-image-accept');

    }
    showEmojiList(){

        this.iconListEl.style.display = 'none';

        this.emojiListEl.style.display = 'flex';

    }

    changeIcon(iconName, iconStyle){

        this.iconChangeEl.textContent = '';

        this.iconChangeEl.className = `${iconStyle} ${iconName}`;

    }

    changeEmoji(emoji){

        this.iconChangeEl.textContent = emoji;

        this.iconChangeEl.className = '';

    }
    changeFavoriteMsg(msg){

        const favoriteEl = document.querySelector(`[data-action="addNoteToFavorite"]`);

        //console.log(favoriteEl);

        favoriteEl.children[1].textContent = msg;

    }

    showIconList(){

        this.iconListEl.style.display = 'flex';

        this.emojiListEl.style.display = 'none';

    }

    showRename(title){

        this.titleEl.textContent = `Rename note: ${title}`;
        this.resultImg.style.display = 'none';
        this.imgInfo.style.display = 'none';
        this.iconWrapper.style.display = 'none';
        this.textInput.style.display = 'block';
        this.deleteInput.style.display = 'none';

    }
    showDeleteNote(title){

        this.titleEl.textContent = `Delete note: ${title}`;
        this.resultImg.style.display = 'none';
        this.imgInfo.style.display = 'none';
        this.iconWrapper.style.display = 'none';
        this.textInput.style.display = 'none';
        this.deleteInput.style.display = 'block';

    }
    showIcon(title, icon, emoji){

        const titleEl = document.getElementById('change-note-icon-title');

        titleEl.textContent = title;

        if(icon) this.setIcon(icon);
        if(emoji) this.setEmoji(emoji);

        this.titleEl.textContent = `Change icon from note:`;
        this.resultImg.style.display = 'none';
        this.imgInfo.style.display = 'none';
        this.iconWrapper.style.display = 'flex';
        this.textInput.style.display = 'none';
        this.deleteInput.style.display = 'none';

    }
    renderImagePreview(file){

        try{

            if(!file || file === '') return;

            const reader = new FileReader();

            reader.onload = (event) => {

                this.imgResultEl.src = event.target.result;

            }

            reader.onerror = (error) => {

                throw new Error(error);

            }

            this.imgNameEl.textContent = file.name;

            reader.readAsDataURL(file);

            this.inputImageSucess();

        }catch(err){

            this.logError(err);

        }
        

    }

    inputImageSucess(){

        this.changeImageAccept.style.background = '#00942E'
        this.changeImageAccept.style.background = 'linear-gradient(0deg, #00942E 10%, #00A634 100%)';
        this.changeImageAccept.style.background = '-webkit-linear-gradient(0deg, #00942E 10%, #00A634 100%)';

        setTimeout(()=>{

            this.changeImageAccept.style.background = '#470094';
            this.changeImageAccept.style.background = 'linear-gradient(0deg, #470094 10%, #6b00e0 100%)';
            this.changeImageAccept.style.background = '-webkit-linear-gradient(0deg, #470094 10%, #6b00e0 100%)';

        }, 5000);

    }
    showBackground(title, background){

        //console.log(title, background);

        this.titleEl.textContent = `Change background: ${title}`;

        this.resultImg.style.display = 'flex';
        this.imgInfo.style.display = 'flex';
        this.iconWrapper.style.display = 'none';
        this.textInput.style.display = 'none';
        this.deleteInput.style.display = 'none';

        if(!background || background === null || background === undefined){

            this.imgResultEl.src = '/uploads/attachments/default.jpg';
            this.imgNameEl.textContent = 'default.jpg';

        }else{

            this.imgResultEl.src = `/uploads/attachments/${background}`;
            this.imgNameEl.textContent = background;

        }

    }
    cleanEmojiAndIcon(){

        this.iconChangeEl.className = '';
        this.iconChangeEl.textContent = '';

    }

    setEmoji(emoji){

        this.cleanEmojiAndIcon();

        this.iconChangeEl.textContent = emoji;

    }
    setIcon(icon){

        this.cleanEmojiAndIcon();

        this.iconChangeEl.className = icon;

    }

    clear(){

        this.textInput.value = '';
        this.deleteInput.value = '';
        this.noteImgInput.value = '';
        this.imgResultEl.src = '/uploads/attachments/default.jpg';
        document.getElementById('change-note-icons-filter').value = '';

    }

    logError(err){

        const logEl = document.getElementById('change-note-error-log');

        logEl.textContent = err;

        logEl.style.color = '#D91E0B';

        setTimeout(()=>this.clearErr(logEl), 10000);

    }
    clearErr(el){

        el.textContent = '';
        this.clear();

    }

}