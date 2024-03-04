class NoteController {

    constructor() {

        this._calendarDate = new Date();
        this._tempElement;
        this._allNotesGroup = document.querySelector('.wrapper-created-categories');
        this._allCheckboxEl = [];
        this._trueCheckbox;
        this._allNotes = document.querySelector('.notes-list');
        this._allNotesCheckboxEl = [];
        this._trueNoteCheckbox;

    }

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

        viewControler.addCalendarDivsClickEvents(currentMonth);
    }

    removeElement(group, element){

        group.removeChild(element);

    }

    createNewNotesGroup(group) {
        let input;

        this._tempElement = document.querySelector('#temp-categorie')

        if(!this._tempElement ||  this._tempElement == null){
            let div = document.createElement('div');

            div.innerHTML = `
                            <button title="Cancel operation" id="button-temp-cancel-categorie"><i class="fa-solid fa-xmark"></i></button>
                            <label for="temp-checkbox">
                                <i class="fa-regular fa-file-image"></i>
                                <input type="text" id="temp-input">
                            </label>
                        `;
            div.className = 'categories';
            div.id = 'temp-categorie';
            group.appendChild(div);

            input = document.getElementById("temp-input");

            this.whaitUserSendInput(input, group);

        }else if(this._tempElement){

            return;

        }
        return initButtonEvents();
    }

    whaitUserSendInput(userInput, originGroup) {

        userInput.addEventListener('keyup', e => {
            if (e.keyCode == 13) {
                if (!userInput.value || userInput.value == "") {
                    alert("The content of a categorie don't can be empty")
                } else if (userInput.value) {

                    //console.log(userInput.value);
                    this.createCategorieElement(userInput.value, originGroup);
                }
            }

        });

    }
    createCategorieElement(elementName, destineGroup) {

        let div = document.createElement('div');

        div.innerHTML = `
                        <input type="checkbox" name="checkbox-${elementName}" id="categories-${elementName}-checkbox">
                        <label for="categories-${elementName}-checkbox">
                        <i class="fa-regular fa-file-image"></i>
                            <span>${elementName}</span>
                        </label>
                    `;
        div.className = 'categories';
        destineGroup.appendChild(div);
        destineGroup.removeChild(document.getElementById('temp-categorie'));
        this.oneChecked(this._allNotesGroup.childNodes, this._allCheckboxEl, this._trueCheckbox);

    }
    oneChecked(htmlGroup, htmlSubGroup, checkedElement){
        htmlGroup.forEach(categorie=>{
            categorie.childNodes.forEach(element=>{
                if(element.type == "checkbox"){
                    htmlSubGroup.push(element);
                    //console.log(htmlSubGroup);
                    
                    element.addEventListener('change',e=>{
    
                        if(element.checked){
                            checkedElement = element;
                            htmlSubGroup.forEach(element=>{
                                //console.log(element);
                                element.checked = false;
                                checkedElement.checked = true;
                            });
                        }
                    
                    });
                }
            });
        });
    
    }

}