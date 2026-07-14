export class ContextMenuView{

    constructor(){

        this.titleEl = document.getElementById('change-note-title');
        this.resultImg = document.getElementById('change-note-result');
        this.imgInfo = document.getElementById('change-note-img-info');

        this.textInput = document.getElementById('change-note-input');

        this.imgResultEl = document.getElementById('change-note-background-result');
        this.imgNameEl = document.getElementById('change-note-image-name');
        this.noteImgInput = document.getElementById('change-note-image');

    }

    showRename(title){

        this.titleEl.textContent = `Rename note: ${title}`;
        this.resultImg.style.display = 'none';
        this.imgInfo.style.display = 'none';
        this.textInput.style.display = 'block';

    }

    clear(){

        this.textInput.value = '';
        this.noteImgInput.value = '';
        this.imgResultEl.src = '/uploads/attachments/default.jpg';

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