class View {

    constructor(){

        this._calendarDivs = document.querySelector('.wrapper-calendar-month-days');
        this.lastLine = [];
        this.firstTextEntry = true;
        this.usersSelectedElement = "";

    }

    showElement(element){

        if (element.style.display ==  "none" || !element.style.display){

            element.style.display = "flex";

        }else if (element.style.display ==  "flex"){

            element.style.display = "none";

        }
        
    }
    CreateCalendarEl(calendarEl, summary, dates){

        //console.dir(calendarEl);

        calendarEl.children[0].firstElementChild.innerHTML = summary;
        calendarEl.children[2].innerHTML = dates;

    }
    addCalendarDivsClickEvents(month, year){

        this._calendarDivs.childNodes.forEach(dat=>{

            dat.addEventListener('click', e=>{

                if(dat.className == 'this-month'){
                    dat.className = 'calendar-div-select';
                }else if(dat.className == 'calendar-div-select'){
                    dat.className = 'this-month';
                }
                if(dat.className == 'no-this-month'){
                    dat.className = 'calendar-div-select-no';
                }else if(dat.className == 'calendar-div-select-no'){
                    dat.className = 'no-this-month';
                }
            });

        })
        let one;
        this._calendarDivs.childNodes.forEach(dat=>{
            if(one !== true && dat.innerText == new Date().getDate() && month == new Date().getMonth() && year == new Date().getFullYear()){
                one = true;
                dat.id = 'calendar-today';
            }
        });

    }

    filterText(userDigits, originElement){

        let pressBackSpace;

        if(userDigits.key === "Backspace"){

            pressBackSpace = true;

        }
        if(userDigits.key === "Enter"){

            userDigits.preventDefault();

            if(this.usersSelectedElement.classList[0] === 'mainText' || this.usersSelectedElement.classList[0] === 'h1' || this.usersSelectedElement.classList[0] === 'h2' || this.usersSelectedElement.classList[0] === 'h3'|| this.usersSelectedElement.classList[0] === 'h4'){

                this.createParagraph(this.usersSelectedElement, '/text', true);

            }
            if(this.usersSelectedElement.classList[0] === 'numbered-list' || this.usersSelectedElement.parentNode.classList[0] === 'numbered-list' || this.usersSelectedElement.classList[0] === 'dotted-list' || this.usersSelectedElement.parentNode.classList[0] === 'dotted-list'){

                this.addNewSubElement(this.usersSelectedElement, 'li');

            }
            if(this.usersSelectedElement.classList[0] === 'details-div'){

                this.addNewSubElement(this.usersSelectedElement, 'alternate-div');

            }

            this.lastLine = '';

        }
        if(userDigits.key !== "Backspace" && (userDigits.key.length > 1 || userDigits.key === " ")){

            if(userDigits.key === "Shift"){

                this.lastLine = this.lastLine;

            }
            this.lastLine = '';

        }else{

            if(!pressBackSpace){

                this.lastLine = this.lastLine + userDigits.key

            }else{

                this.lastLine = this.lastLine.substring(0, this.lastLine.length - 1);

            }

        }

        //console.log(this.lastLine, userDigits);
    }

    watchTheSelectElement(element){

        element.addEventListener('click', e=>{

            this.usersSelectedElement = e.target;

        });

    }
    captureUserDigitEntry(element){

        element.addEventListener('keydown', e=>{

            this.formatNoteContent(e, element)

        });

    }

    editNoteContent(event, element){ 
        
        //console.log(event);
        
        if(this.firstTextEntry && event.isTrusted){

            let div = this.createDiv();

            div.focus();

            div.classList.add('mainText');

            this.watchTheSelectElement(div);
            this.captureUserDigitEntry(div);

            element.appendChild(div);

            this.firstTextEntry = false;

        }


        //console.log(event, noteContentText.length);
    }

    formatNoteContent(event, elementToFilter){

        this.filterText(event, elementToFilter);

        let lastLine = this.lastLine;
        console.log(lastLine);
        
        switch(lastLine){
            
            case '/text':
                this.createParagraph(this.usersSelectedElement, lastLine);
                break;
            case '/dotted-list':
                this.createDottedList(this.usersSelectedElement, lastLine);
                break;
            case '/h1':
                this.createHeader(this.usersSelectedElement, lastLine);
                break;
            case '/h2':
                this.createHeader(this.usersSelectedElement, lastLine);
                break;
            case '/h3':
                this.createHeader(this.usersSelectedElement, lastLine);
                break;
            case '/h4':
                this.createHeader(this.usersSelectedElement, lastLine);
                break;
            case '/numbered-list':
                this.createNumberedList(this.usersSelectedElement, lastLine);
                break;
            case '/roman-list':
                this.createNumberedList(this.usersSelectedElement, lastLine);
                break;
            case '/alternate-list':
                this.createAlternateList(this.usersSelectedElement, lastLine);
                break;
            default:
                //this.textEntry(element);
                break;
      
        }

    }

    createDiv(){

        let div = document.createElement('div');
        div.innerHTML = "<br>";

        div.contentEditable = true;

        return div;

    }
    createLi(){

        let li = document.createElement('li');
        li.innerHTML = "<br>";

        return li;

    }

    addNewSubElement(refElement, elementType){
        
        if(elementType == 'li'){

            let li = this.createLi();

            refElement.parentNode.insertBefore(li, refElement.nextSibling);
            this.watchTheSelectElement(li);
            this.captureUserDigitEntry(li);

        }
        if(elementType == 'alternate-div'){

            let div = this.createDiv();

            div.classList.add('details-div');

            refElement.parentNode.insertBefore(div, refElement.nextSibling);

            this.watchTheSelectElement(div);
            this.captureUserDigitEntry(div);

        }

    }

    removeComand(element, command){

        setTimeout(()=>{ //This is use because if be more fast the last caracter don't will be put in the element

            element.parentNode.childNodes.forEach(child=>{

                console.log(child);
    
                if(child.nodeName === '#text' || child.nodeName === 'DIV' || child.nodeName === 'LI'){
    
                    child.textContent = this.removeText(child.textContent, command);
    
                    console.log(child.textContent);
                    
                    if(!child.textContent){
                        if(child.classList[0] === 'h1' || child.classList[0] === 'h2' || child.classList[0] === 'h3' || child.classList[0] === 'h4'){
                            return;
                        }else{
                            element.parentNode.removeChild(child);
                        }
                    }

                }else if(child.nodeName === 'UL'){

                    child.childNodes.forEach(liElement=>{
    
                        console.log(command);
    
                        liElement.textContent = this.removeText(liElement.textContent, command);
    
                        console.log(child.textContent);

                    });

                }
    
            });

        }, 1);

    }

    removeText(text, textToRemove){

        text = text.replace(textToRemove, '');

        return text;
    }

    createParagraph(refElement, tagName, enter=false){

        if(!enter){

            //console.log(refElement);
            this.removeComand(refElement, tagName);

        }

        let div = this.createDiv();
        this.watchTheSelectElement(div);
        this.captureUserDigitEntry(div);

        div.classList.add('mainText');

        console.log(refElement.nodeName);

        if(refElement.nodeName === "LI" || (refElement.nodeName === 'DIV' && refElement.classList[0] === 'details-div')){

            refElement.parentNode.parentNode.insertBefore(div, refElement.nextSibling);

        }else{

            refElement.parentNode.insertBefore(div, refElement.nextSibling);

        }

        this.lastLine = '';

    }

    createNumberedList(refElement, tagName){

        this.removeComand(refElement, tagName);

        let ol = document.createElement('ol');
        let li = this.createLi();
        
        ol.appendChild(li);
        ol.contentEditable = true;
        this.watchTheSelectElement(ol);
        this.captureUserDigitEntry(ol);

        ol.classList.add(tagName.replace('/', ''));

        refElement.parentNode.insertBefore(ol, refElement.nextSibling);

        this.lastLine = '';

    }

    createAlternateList(refElement, tagName){

        this.removeComand(refElement, tagName);

        let details = document.createElement('details');
        let summary = document.createElement('summary');
        let div = this.createDiv();

        summary.innerHTML = '<br>';
        div.innerHTML = '<br>';

        details.contentEditable = true;
        summary.contentEditable = true;
        div.contentEditable = true;

        details.appendChild(summary);
        details.appendChild(div);
        this.watchTheSelectElement(details);
        this.captureUserDigitEntry(details);

        details.classList.add(tagName.replace('/', ''));
        div.classList.add('details-div');

        refElement.parentNode.insertBefore(details, refElement.nextSibling);

        this.lastLine = '';

    }

    createDottedList(refElement, tagName){

        this.removeComand(refElement, tagName);

        let ul = document.createElement('ul');
        let li = this.createLi();

        ul.appendChild(li);
        ul.contentEditable = true;
        this.watchTheSelectElement(ul);
        this.captureUserDigitEntry(ul);

        
        ul.classList.add(tagName.replace('/', ''));

        
        refElement.parentNode.insertBefore(ul, refElement.nextSibling);

        this.lastLine = '';

    }
    createHeader(refElement, tagName){

        this.removeComand(refElement, tagName);

        let div = this.createDiv();

        this.watchTheSelectElement(div);
        this.captureUserDigitEntry(div);

        div.classList.add(tagName.replace('/', ''))

        refElement.parentNode.insertBefore(div, refElement.nextSibling);

        this.lastLine = '';

    }

}