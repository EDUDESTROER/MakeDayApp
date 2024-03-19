window.viewControler = new View();
window.noteControler = new NoteController();

this._locale = navigator.language;
this._usersMenu = document.querySelector('#user-menu-wrapper');
this._wrapperCategories = document.querySelector('.wrapper-categories');
this._calendarElement = document.querySelector('#calendar');
this._searchBarElement = document.querySelector('#search-bar');
this.initButtonEvents();
//noteControler.oneChecked(noteControler._allNotesGroup.childNodes, noteControler._allCheckboxEl, noteControler._trueCheckbox);
//noteControler.oneChecked(noteControler._allNotesEl.childNodes, noteControler._allNotesCheckboxEl, noteControler._trueNoteCheckbox);


function functionsBtn(value, originBtn){

    switch(value){

        case 'menu-users':
            viewControler.showElement(this._usersMenu);
            break;
        case 'menu-bar':
            if(!this._wrapperCategories.style.display){
                this._wrapperCategories.style.display = "flex";
            }
            viewControler.showElement(this._wrapperCategories);
            break;
        case 'menu-users-close':
            viewControler.showElement(this._usersMenu);
            break;
        case 'calendar-up':
            noteControler.changeMonth(this._calendarElement, this._locale, true);
            break;
        case 'calendar-down':
            noteControler.changeMonth(this._calendarElement, this._locale, false);
            break;    
        case 'calendar':
            noteControler.formatCalendar(this._calendarElement, this._locale, true);
            viewControler.showElement(this._calendarElement);
            break;
        case 'search':
            viewControler.showElement(this._searchBarElement);
            break;
        case 'new-note-group':
            noteControler.createNewNotesGroup(noteControler._allNotesGroup, 'noteGroup');
            break;
        case 'temp-cancel-categorie':
            try {
                noteControler.removeElement(noteControler._allNotesGroup, document.getElementById('temp-categorie'));
            } catch {
                noteControler.removeElement(noteControler._allNotesEl, document.getElementById('temp-categorie'));
            }
            break;
        case 'new-note':
            noteControler.createNewNotesGroup(noteControler._allNotesEl, 'note');
            break;
        case 'note-trash':
            noteControler.sendTotrash(originBtn, value);//Value comes from noteControler.addClickToAbutton
            break;
        default:
            console.error(value, ' Is not a valid button')
            break;
    }

}
function initButtonEvents(){
    let buttons = document.querySelectorAll('button');

    buttons.forEach(btn=>{
        btn.addEventListener('click', e=>{

            let textBtn = btn.id.replace("button-", "");
            if(!textBtn){
                textBtn = btn.className.replace("button-", "");
            }
            this.functionsBtn(textBtn, btn);

        });
    });
}