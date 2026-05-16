export class WorkspaceView{

    constructor(){

        this.firstShow = true;
        this.menuHidden = false;
        this.firstPanelElement = true;
        this.focusId = '#left-side-bar';
        this.wideScreen = this.checkDevice();
        this.checkResize();
        this.smartDashboardEl = this.getDashboard();
        this.selectIconEmojiBtn = document.getElementById('newNoteIconBtn');
        this.newNoteWrappers = {
            'icons': document.querySelector('.new-note-icons'),
            'emojis': document.querySelector('.new-note-emojis')
        }
        this.newNoteWrapperSelect = 'icons';
    }

    toggleIconsEmojis(el){

        this.selectIconEmojiBtn?.classList.remove('select-style')

        el.classList.add('select-style');

        this.selectIconEmojiBtn = el;

        //console.log(this.newNoteWrappers[this.newNoteWrapperSelect])

        this.unShowEl(`#${this.newNoteWrappers[this.newNoteWrapperSelect].id}`);

        this.newNoteWrapperSelect = el.textContent.toLowerCase();

        this.showEl(`#${this.newNoteWrappers[this.newNoteWrapperSelect].id}`);

        //console.log(el);

    }

    getDashboard(){

        return document.querySelector('.wrapper-smart-history');

    }

    showEl(id){

        let el = document.querySelector(id);

        el.style.opacity = '100';

        el.removeAttribute('inert');

        //console.log(id);

    }

    unShowEl(id){

        let el = document.querySelector(id);

        //console.log(el);

        el.style.opacity = '0';

        el.setAttribute('inert', '');

    }

    hiddenMenu(id){

        if(this.menuHidden){

            this.showEl(id);

            let el = document.querySelector(id);

            el.style.position = 'static';

            this.menuHidden = false;

        }else{

            this.unShowEl(id);

            let el = document.querySelector(id);

            el.style.position = 'absolute';

            this.menuHidden = true;

        }

    }

    checkDevice(){

        const isDesktop = window.matchMedia("(min-width: 900px)").matches;

        let result = false;

        if(isDesktop) {

            result = true; 

            if(this.firstShow || this.focusId === '#left-side-bar'){

                this.showEl('#smart-dashboard');          
                this.focusId = '#smart-dashboard';        

            }else{

                this.flowControl(this.focusId); 
                this.showEl('#left-side-bar');


            }

            this.firstShow = false;

        }else{

            
            this.flowControl('#left-side-bar');


        }

        this.menuHidden = true;
        this.hiddenMenu('#left-side-bar');

        return result;

    }
    checkResize(){

        const media = window.matchMedia("(min-width: 900px)");

        media.addEventListener("change", (e) => {
            
            this.wideScreen = this.checkDevice();


        });

    }

    flowControl(id){

        this.unShowEl(this.focusId);

        //console.log('Focus: ', id);

        this.showEl(`${id}`);

        //console.log('Unfocus: ', this.focusId);

        this.focusId = `${id}`;

    }

    renderSmartDashboard(note, info, steps, endTime){

        const wrapper = document.createElement('div');

        if(this.firstPanelElement) {
            wrapper.className = 'wrapper-smart-card buttons-basic-efects smart-card-select';
            this.firstPanelElement = false;
        }else{
            wrapper.className = 'wrapper-smart-card buttons-basic-efects';
        }
        

        wrapper.dataset.noteId = note.id;
        wrapper.dataset.action = 'openNote';

        const header = this.assemblerSmartHeader(note.icon, note.emoji, info, note.title);
        const stepsEl = this.assemblerStepsWrapper(steps);

        const timerEl = this.assemblerTimerWrapper(endTime);

        wrapper.append(header, stepsEl, timerEl);

        this.smartDashboardEl.appendChild(wrapper);

    }

    assemblerTimerWrapper(time){

        const wrapper = document.createElement('div');

        wrapper.className = 'smart-timer';

        const span = document.createElement('span');

        span.textContent = time;

        wrapper.appendChild(span);

        return wrapper;

    }

    assemblerStepsWrapper(stepsObj){

        const wrapper = document.createElement('div');

        wrapper.className = 'wrapper-smart-steps';

        const stepsDoneEl = this.createStepsSpan('smart-steps-done', stepsObj.done);
        const stepsNotDoneEl = this.createStepsSpan('smart-steps-not-done', `/${stepsObj.notDone}`);

        wrapper.append(stepsDoneEl, stepsNotDoneEl);

        return wrapper;

    }

    createStepsSpan(id, content){

        const span = document.createElement('span');

        span.id = id;
        span.textContent = content;

        return span;

    }

    assemblerSmartHeader(icon, emoji, info, title){

        const header = document.createElement('div');

        header.className = 'smart-card-header';

        const iconEl = this.getSmartIcon(icon, emoji, info);

        const titleEl = this.getSmartTitle(title);

        header.append(iconEl, titleEl);

        return header;

    }

    getSmartTitle(title){

        const wrapper = document.createElement('div');

        wrapper.className = 'wrapper-smart-title';

        wrapper.textContent = title;

        return wrapper;

    }

    getSmartIcon(icon, emoji, info){

        const wrapper = document.createElement('div');

        wrapper.classList.add('wrapper-smart-icon', info);

        const iconEl = document.createElement('i');

        if(!icon){
            iconEl.textContent = emoji;
        }else{
            iconEl.className = icon;
        }

        wrapper.appendChild(iconEl);

        return wrapper;

    }

    errorLog(logElementId, error){

        let elementToLog = document.querySelector(logElementId);

        elementToLog.textContent = '';

        elementToLog.textContent = error;

    }

}