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
        this.avatarPreviewImage = document.getElementById('change-account-avatar-image');
        this.avatarPreviewImageResult = document.getElementById('change-account-avatar-result');
        this.avatarPreviewTitle = document.getElementById('change-account-avatar-image-name');
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

    updateUsernameInView(name, apresentation){

        document.getElementById('username').textContent = name;
        document.getElementById('username-delete-account').textContent = name;
        document.getElementById('wrapper-user-menu-username').textContent = name
        document.getElementById('presentation-header-name').textContent = apresentation;

    }
    updateEmailInView(email){

        document.getElementById('wrapper-user-menu-email').textContent = email;

    }
    updateApresentationDayInView(welcome){

        document.getElementById('presentation-header-day').textContent = welcome;

    }
    updateUserAvatarInView(avatarPath){

        const picture = document.getElementById('user-menu-picture');
        const avatar = document.getElementById('user-avatar');

        picture.src = '';
        avatar.src = '';

        picture.src = avatarPath;
        avatar.src = avatarPath;

    }
    updateModalChangeAccountInfo(infoArray){

        document.getElementById('change-account-info-first-title').textContent = infoArray[0];
        document.getElementById('change-account-info-first-input').placeholder = infoArray[1];

    }

    renderAvatarPreview(file){

        try{

            if(!file || file === '') return;

            const reader = new FileReader();

            reader.onload = (event) =>{
                this.avatarPreviewImageResult.src = event.target.result;
            };

            reader.onerror = (error) => {
                throw new Error(error);
            };

            this.avatarPreviewTitle.textContent = file.name;

            reader.readAsDataURL(file);

            //console.log(this.avatarPreviewImage);

            this.inputImageSucess();


        }catch(err){

            this.inputImageError();

        }

    }
    inputImageSucess(){

        const btn = document.getElementById('change-account-avatar-image-accept');

        btn.className = 'note-btn buttuns-green-style';

        setTimeout(()=>{

            btn.className = 'note-btn buttuns-purple-style';

        }, 10000);

    }

    inputImageError(){

        const log = {
            elementToLog: 'change-account-avatar-error-log',
            textToLog: `Error in load image!`,
            elementsToStyle: ['change-account-avatar-image-accept'],
            elementToClearn: ['change-account-avatar-image']
        };

        const btn = document.getElementById('change-account-avatar-image-accept');

        btn.className = 'note-btn buttuns-red-style';

        setTimeout(()=>{

            btn.className = 'note-btn buttuns-purple-style';

        }, 10000);

        this.logErrorIn(log);

    }
    resetChangeAvatar(){

        const password = document.getElementById('change-account-avatar-password');

        this.avatarPreviewImageResult.src = '/uploads/avatares/default.png';
        this.avatarPreviewTitle.textContent = 'image-name.jpg';
        password.value = '';
        this.avatarPreviewImage.value = '';


    }

    closeDisplay(id){

        document.getElementById(id).style.display = 'none';

    }
    openDisplay(id){

        document.getElementById(id).style.display = 'block';

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

        //console.log('Unfocus: ', this.focusId);

        this.unShowEl(this.focusId);

        //console.log('Focus: ', id);

        this.showEl(`${id}`);

        this.focusId = `${id}`;

    }

    renderFlameProfile(infoObject){

        this.renderStreak(infoObject.streak);
        this.renderTodayGoal(infoObject.todayGoal);
        this.assemblerWeekProgress(infoObject.weekProgress);

    }

    renderStreak(days){

        //console.log('render Streak: ' + days);

        const img = document.getElementById('flame-img-el');

        const flameTitle = document.getElementById('flame-days-output');

        const streaks = [50, 40, 30, 20, 10, 1];

        const iconKey = streaks.find(value => days >= value) ?? 0;

        img.src = `/icons/flameIcons/${iconKey}days.png`;

        flameTitle.textContent = days;

    }

    renderTodayGoal(goal){

        //console.log('Today goal: ', goal);

        const doneEl = document.getElementById('steps-card-done');
        const undoneEl = document.getElementById('steps-card-undone');
        const percentageEl = document.getElementById('steps-card-percentage');
        const barDone = document.getElementById('bar-done');

        const percentageAmount = (goal.current / goal.target) || 0;

        doneEl.textContent = goal.current;
        undoneEl.textContent = `/${goal.target}`;
        percentageEl.textContent = `${percentageAmount}%`;

        barDone.style.width = `${percentageAmount}%`;

    }

    assemblerWeekProgress(week){

        //console.log('Render Week Progress: ', week);

        let i = 1;

        week.forEach(day=>{

            Object.values(day).forEach(value=>{

                //console.log(value);

                this.renderWeekDayTitle(value[0], i);

                this.renderPercentageInfo(value[1], i);

                i++;

            });

        });

    }

    renderPercentageInfo(percentage, position){

        //console.log('Render Percentage: ', percentage, ' In position: ', position);

        const lineEl = document.getElementById(`user-info-${position}-line`);

        const circumference = 282.744;
        const dashOffset = circumference * (1 - percentage);

        //console.log(lineEl);

        lineEl.setAttribute('stroke-dashoffset', dashOffset);
        lineEl.setAttribute('fill', 'none');

        if(percentage === 1){

            const back = document.getElementById(`user-info-${position}-back`);
            const icon = document.getElementById(`user-info-${position}-icon`);

            back.setAttribute('fill', '#05F900');

            icon.style.display = 'block';
            icon.className = 'fa-solid fa-check-double';

        }else if(percentage === 0){

            const back = document.getElementById(`user-info-${position}-back`);
            const icon = document.getElementById(`user-info-${position}-icon`);

            back.setAttribute('fill', '#FF1307');

            icon.style.display = 'block';
            icon.className = 'fa-solid fa-x';

        }else{

            const back = document.getElementById(`user-info-${position}-back`);

            back.setAttribute('fill', '#3a3b3b');

        }


    }

    renderWeekDayTitle(title, position){

        //console.log('Render week title: ', title);

        const el = document.getElementById(`user-info-${position}-day`);

        el.textContent = title;

    }

    renderAchievementsProfile(achievements){

        const parent = document.querySelector('.wrapper-user-menu-achievements');

        achievements.forEach(achievement=>{

            const wrapper = this.getAchievementWrapper();
            const img = this.getImgAchivement(achievement.name);

            wrapper.appendChild(img);

            parent.appendChild(wrapper)

        });

    }

    getImgAchivement(name){

        //console.log(name);

        const img = document.createElement('img');

        img.src = `/icons/${name}.png`

        const title = `${name.replace('_', ' ')} achievement`;

        img.title = title;

        img.alt = `${title} icon`

        return img;

    }

    getAchievementWrapper(){

        const div = document.createElement('div');

        div.className = 'achievements-card list-style';

        return div;

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
    logErrorIn(logObj){
        //console.log(logObj);

        const el = document.getElementById(logObj.elementToLog);

        el.textContent = logObj.textToLog;

        //console.log(el);

        el.style.display = 'block';

        if(logObj.elementsToStyle.length > 0){

            logObj.elementsToStyle.forEach(elName=>{

                const elToStyle = document.getElementById(elName);

                elToStyle.style.borderColor = '#D91E0B';

            });

        }

        if(logObj.elementToClearn.length > 0){

            logObj.elementToClearn.forEach(name=>{

                document.getElementById(name).value = '';

            });

        }

        setTimeout(() => this.clearLogError(logObj), 10000);

    }
    clearLogError(logObj){

        const el = document.getElementById(logObj.elementToLog);

        el.textContent = '';

        el.style.display = 'none';

        if(logObj.elementsToStyle){

            logObj.elementsToStyle.forEach(elName=>{

                const elToStyle = document.getElementById(elName);

                elToStyle.style.borderColor = '#000';

            });

        }

    }
    clearChangeAccountInfoInput(){

        const firstInput = document.getElementById('change-account-info-first-input');
        const secondInput = document.getElementById('change-account-info-second-input');

        firstInput.value = '';
        secondInput.value = '';

    }

}