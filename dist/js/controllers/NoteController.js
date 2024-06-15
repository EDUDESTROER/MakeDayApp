class NoteController {

    constructor() {

        this.userName = 'Eduardo Salvador';
        this._calendarDate = new Date();
        this._tempElement;
        this._allNotesGroup = document.querySelector('.wrapper-created-categories');
        this._allCheckboxEl = [];
        this._trueCheckbox;
        this._allNotesEl = document.querySelector('.notes-list');
        this._allNotesCheckboxEl = [];
        this._trueNoteCheckbox;
        this._allCategories = [];
        this._noteContentEl = document.querySelector('.wrapper-note-content');
        this.loadUserName();

    }

    loadUserName(){

        document.querySelector('#user-name').innerHTML = this.userName;

    };

    changeMonth(calendarup, languageup, sum) {

        if (sum === true) {
            this._calendarDate.setMonth(this._calendarDate.getMonth() + 1);
        } else if (sum === false) {
            this._calendarDate.setMonth(this._calendarDate.getMonth() - 1);
        }


        this.formatCalendar(calendarup, languageup, false);

    }

    formatCalendar(calendar, language, calendarReset) {

        if (calendarReset === true) {
            this._calendarDate = new Date();
        }

        let monthYearInString = this._calendarDate.toLocaleString(language, { month: 'long', year: 'numeric' });

        let currentYear = this._calendarDate.getFullYear();
        let currentMonth = this._calendarDate.getMonth();

        let firstDay = new Date(currentYear, currentMonth, 0)
        let lastDay = new Date(currentYear, currentMonth + 1, 0)
        let totalDays = lastDay.getDate();
        let firstDayI = firstDay.getDay();

        //console.log(currentYear, currentMonth, firstDayI, firstDay.getDay());

        let datesHTML = '';

        for (let i = firstDayI; i > 0; i--) {
            let prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
            datesHTML += `<div class="no-this-month">${prevDate.getDate()}</div>`;
        }
        for (let i = 1; i <= totalDays; i++) {
            datesHTML += `<div class="this-month">${i}</div>`
        }
        for (let i = 1; i <= 15; i++) {
            let nextDate = new Date(currentYear, currentMonth + 1, i);
            datesHTML += `<div class="no-this-month">${nextDate.getDate()}</div>`;
        }

        viewControler.CreateCalendarEl(calendar, monthYearInString, datesHTML);

        //console.dir(calendarDivs);

        viewControler.addCalendarDivsClickEvents(currentMonth, currentYear);
    }

    removeElement(group, element) {

        group.removeChild(element);

    }

    createNewNotesGroup(group, elementType) {
        let input;

        this._tempElement = document.querySelector('#temp-categorie')

        if (!this._tempElement || this._tempElement == null) {
            let div = document.createElement('div');

            div.innerHTML = `
                            <button title="Cancel operation" id="button-temp-cancel-categorie"><i class="fa-solid fa-xmark"></i></button>
                            <label for="temp-checkbox">
                                <i class="fa-regular fa-file-image"></i>
                                <input type="text" id="temp-input">
                            </label>
                        `;
            if (elementType == 'noteGroup') {
                div.className = 'categories';
            } else if (elementType == 'note') {
                div.className = 'note';
            }
            div.id = 'temp-categorie';

            this.addClickToAbutton(div.querySelector('button'));

            group.appendChild(div);

            input = document.getElementById("temp-input");

            this.whaitUserSendInput(input, group, elementType);

        } else if (this._tempElement) {

            return;

        }
    }

    whaitUserSendInput(userInput, originGroup, elementType) {

        userInput.addEventListener('keyup', e => {
            if (e.keyCode == 13) {
                if (!userInput.value || userInput.value == "") {
                    alert("The content of a categorie don't can be empty")
                } else if (userInput.value) {

                    //console.log(userInput.value);
                    this.createCategorieElement(userInput.value, originGroup, elementType);
                }
            }

        });

    }
    createCategorieElement(elementName, destineGroup, elementType) {

        let div = document.createElement('div');

        if (elementType == 'noteGroup') {
            div.innerHTML = `
                            <input type="checkbox" name="checkbox-${elementName}" id="categories-${elementName}-checkbox">
                            <label for="categories-${elementName}-checkbox">
                            <i class="fa-regular fa-file-image"></i>
                                <span>${elementName}</span>
                            </label>
                        `;
            div.className = 'categories';

            this.createCategorieObject(elementName, new Date(), div.querySelector('i'), div);
            

        } else if (elementType == 'note') {

            let ownerElement;

            try {
                if(this._trueCheckbox.checked){
                    ownerElement = this._trueCheckbox.parentElement.id;
                }else{
                    alert('You need Select a Categorie for the element!');
                    return;
                }
            } catch {
                alert('You need Select a Categorie for the element!');
                return;
            }

            let id = this.CreateUnicCod(elementName,  new Date(), this.userName)

            div.innerHTML = `
                        <input type="checkbox" id="checkbox-note-${id}">
                        <label for="checkbox-note-${id}">
                            <div class="note-img">
                                <i class="fa-solid fa-image"></i>
                            </div>
                            <div class="note-information">
                                <span class="note-name">${elementName}</span>
                                <time class="note-time">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</time>
                            </div>
                            <div class="wrapper-trash">
                                <button class="button-note-trash" title="Send to trash"><i class="fa-solid fa-trash-can-arrow-up"></i></button>
                            </div>
                        </label>
                    `;
            div.className = 'note';
            div.id = `note-${id}`;

            let destineObject = this._allCategories.find((element) => element.cod == ownerElement);
            //console.log(destineObject);
            let divObject = this.createNoteObject(elementName, new Date(), div.querySelector('i'), div, id);

            destineObject.childerElement.push(divObject);
            div.classList.add(destineObject.cod);
            //console.log(this._allCategories);

            this.addClickToAbutton(div.querySelector('button'));
        }
        destineGroup.appendChild(div);
        destineGroup.removeChild(document.getElementById('temp-categorie'));
        this.oneChecked(this._allNotesGroup.childNodes, this._allCheckboxEl, this._trueCheckbox);
        this.oneChecked(this._allNotesEl.childNodes, this._allNotesCheckboxEl, this._trueNoteCheckbox);

    }
    oneChecked(htmlGroup, htmlSubGroup, checkedElement) {
        htmlGroup.forEach(categorie => {
            categorie.childNodes.forEach(element => {
                if (element.type == "checkbox") {
                    htmlSubGroup.push(element);
                    //console.log(htmlSubGroup);

                    element.addEventListener('change', e => {

                        if (element.checked) {
                            checkedElement = element;
                            if(element.parentElement.className == 'categories'){
                                this._trueCheckbox = checkedElement;
                                document.getElementById('categorie-name').textContent = checkedElement.name.replace('checkbox-', '');

                                this.showObjectChilds(element.parentNode.id);
                        
                            }else if(element.parentElement.className.split(' ')[0] == 'note'){

                                this._noteContentEl.style.display = 'flex';

                                this._trueNoteCheckbox = checkedElement;

                                this.makeNoteContent(element.parentNode);


                            }
                            htmlSubGroup.forEach(element => {
                                //console.dir(element);
                                element.checked = false;
                                checkedElement.checked = true;
                            });
                        }else if(!element.checked) {
                            if(element.parentElement.className == 'categories'){
                                document.getElementById('categorie-name').textContent = '';
                                this._allNotesEl.childNodes.forEach(element =>{
                                    this._allNotesEl.removeChild(element);
                                });

                                this._noteContentEl.style.display = 'none';

                            }else if(element.parentElement.className.split(' ')[0] == 'note'){

                                this._noteContentEl.style.display = 'none';

                            }
                        }

                    });
                }
            });
        });
    }

    makeNoteContent(noteDiv){

        let refCategorieCod = noteDiv.className.split(' ');
        let refCategorieObject = this._allCategories.find((parentObject) => parentObject.cod == refCategorieCod[1]);
        let refNoteObject = refCategorieObject.childerElement.find((noteObject) => noteObject.cod == noteDiv.id.replace('note-', ''));

        //console.log(refNoteObject.childerElement);
        if(refNoteObject.childerElement && refNoteObject.childerElement.nodeName){

            this._noteContentEl.innerHTML = '';
            this._noteContentEl.appendChild(refNoteObject.childerElement);

        }else if(refNoteObject.childerElement.length <= 0){
            let div = document.createElement('div');

            div.innerHTML = `
                            <img contenteditable="false" draggable="false" class="note-content-icon" src="/dist/img/alfinete.png" alt="A pin image">
                            <div class="note-header">
                                ${refNoteObject.name}
                            </div>
                            <div class="content" spellcheck="false" contenteditable>
                            
                            </div>
            `;
            div.className = 'note-content';

            this._noteContentEl.innerHTML = '';
            this._noteContentEl.appendChild(div);

            refNoteObject.childerElement = div;

            let noteDivContent = div.querySelector('.content');

            noteDivContent.addEventListener('keydown', e =>{

                viewControler.formatNoteContent(e, noteDivContent);

            });
            
        }

    }

    showObjectChilds(parentObjectId){

        let selectParent = this._allCategories.find((parentObject) => parentObject.cod == parentObjectId);

        this._allNotesEl.innerHTML = '';
        if(selectParent.childerElement && selectParent.childerElement.length > 0){

            selectParent.childerElement.forEach(childElement=>{

                this._allNotesEl.appendChild(childElement.element);

            });

        }

    }

    addClickToAbutton(btn){

        //console.log(btn);

        btn.addEventListener('click', e=>{

            let textBtn = btn.id.replace("button-", "");
            if(!textBtn){
                textBtn = btn.className.replace("button-", "");
            }
            functionsBtn(textBtn, btn);

        });

    }

    createCategorieObject(objectName, createTime, icon, refElement) {

        let categorieName = objectName;

        let code = this.CreateUnicCod(objectName, createTime, this.userName);

        refElement.id = code;

        objectName = new Object();
        objectName = {
            cod: code,
            name: categorieName,
            owner: this.userName,
            timeCreated: createTime,
            element: refElement,
            icon: icon,
            childerElement: []
        };
        this._allCategories.push(objectName);
        
    }
    createNoteObject(objectName, createTime, icon, refElement, code){

        let noteName = objectName;

        objectName = new Object();
        objectName = {
            cod: code,
            name: noteName,
            owner: this.userName,
            timeCreated: createTime,
            element: refElement,
            icon: icon,
            childerElement: []
        };
        //console.log(this._allCategories);

        return objectName;

    }

    CreateUnicCod(anyString, timeDate, anyName){
        
        anyName = anyName.split(' ');
        anyString = anyString.split('');

        let code = `${anyName[0]}${timeDate.getHours()}${timeDate.getSeconds()}${timeDate.getMilliseconds()}${anyString[0]}`;

        return code;
    }

    sendTotrash(elementOrigin, elementType){

        if(elementType == 'note-trash'){

            elementOrigin.disabled = true;

            let refNoteElement = elementOrigin.parentElement.parentElement.parentElement;

            let usersAproved = confirm(`The action can't be undone: Delete the note ${refNoteElement.children[1].children[1].children[0].textContent}?`);

            if(usersAproved){
                let refCategorieElementCod = refNoteElement.classList[1];
                let refNoteElementCod = refNoteElement.id.replace('note-', '');
                
                let refCategorieObject = this._allCategories.find(element => element.cod == refCategorieElementCod);
                let refNoteObject = this._allCategories.find(element => element.cod == refCategorieElementCod).childerElement.find(element => element.cod == refNoteElementCod);

                refNoteElement.parentElement.removeChild(refNoteElement);

                let filteredArray= [];

                refCategorieObject.childerElement.filter(value => {

                    value.cod !== refNoteElementCod;
                    if(value.cod !== refNoteElementCod){
                        filteredArray.push(value);
                    }
                    
                });


                refCategorieObject.childerElement = filteredArray;

                console.error(refNoteObject + ' Nedd to be send to a trash page!');
                
            }else{
                alert('Operation canceled!');
            }
        }

    }


}