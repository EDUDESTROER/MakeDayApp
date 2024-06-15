class View {

    constructor(){

        this._calendarDivs = document.querySelector('.wrapper-calendar-month-days');
        this.lastLine = [];
        this.firstTextEntry = true;
        this.lastAddElement = ""

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

            if(this.lastAddElement == 'header'){

                userDigits.preventDefault();

                this.lastLine = '';

                let div = this.createDiv();

                div.classList.add('mainTextFormat')

                originElement.appendChild(div);

                setTimeout(function() {
                    div.focus();
                }, 1000);

            }
            if(this.lastAddElement == 'alternate-list'){

                userDigits.preventDefault();

                this.lastLine = '';

                let div = this.createDiv();

                div.classList.add('mainTextFormat')

                originElement.appendChild(div);

                setTimeout(function() {
                    div.focus();
                }, 1000);

            }

        }
        if(userDigits.key !== "Backspace" && (userDigits.key.length > 1 || userDigits.key === " ")){

            this.lastLine = ''

        }else{

            if(!pressBackSpace){

                this.lastLine = this.lastLine + userDigits.key

            }else{

                this.lastLine = this.lastLine.substring(0, this.lastLine.length - 1);

            }

        }

        //console.log(this.lastLine, userDigits);
    }

    formatNoteContent(event, element){ 
        
        console.log(event);

        this.filterText(event, element);

        let lastLine = this.lastLine;
        console.log(lastLine);
        
        switch(lastLine){
            
            case '/dotted-list':
                this.createDottedList(element, lastLine);
                break;
            case '/h1':
                this.createHeader(element, lastLine);
                break;
            case '/h2':
                this.createHeader(element, lastLine);
                break;
            case '/h3':
                this.createHeader(element, lastLine);
                break;
            case '/h4':
                this.createHeader(element, lastLine);
                break;
            case '/numbered-list':
                this.createNumberedList(element, lastLine);
                break;
            case '/roman-list':
                this.createNumberedList(element, lastLine);
                break;
            case '/alternate-list':
                this.createAlternateList(element, lastLine);
                break;
            default:
                this.textEntry(element);
                break;
                
        }

        //console.log(event, noteContentText.length);
    }

    textEntry(mainElement){

        if(this.firstTextEntry){

            mainElement.textContent = '';

            this.firstTextEntry = false;

            let div = this.createDiv();

            div.classList.add('mainTextFormat')

            mainElement.appendChild(div);

            this.lastAddElement = 'text';

        }
    }

    createDiv(){

        let div = document.createElement('div');
        div.innerHTML = "<br>";

        return div;

    }
    createLi(){

        let li = document.createElement('li');
        li.innerHTML = "<br>";

        return li;

    }
    removeComand(element, command){

        setTimeout(()=>{ //This is use because if be more fast the last caracter don't will be put in the element

            element.childNodes.forEach(child=>{

                console.log(child);
    
                if(child.nodeName === '#text' || child.nodeName === 'DIV'){
    
                    child.textContent = this.removeText(child.textContent, command);
    
                    console.log(child.textContent);
                    
                    if(!child.textContent){
                        element.removeChild(child);
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

    createNumberedList(refElement, tagName){

        this.removeComand(refElement, tagName);

        let ol = document.createElement('ol');
        let emptyDiv = this.createDiv();
        let li = this.createLi();
        
        ol.appendChild(li);

        ol.classList.add(tagName.replace('/', ''));

        refElement.appendChild(ol);
        refElement.appendChild(emptyDiv);

        this.lastLine = ''

        this.lastAddElement = 'numbered-list';

    }

    createAlternateList(refElement, tagName){

        this.removeComand(refElement, tagName);

        let details = document.createElement('details');
        let summary = document.createElement('summary');
        let emptyDiv = this.createDiv();
        let div = this.createDiv();

        summary.innerHTML = '<br>';

        details.appendChild(summary);
        details.appendChild(div);

        details.classList.add(tagName.replace('/', ''));

        refElement.appendChild(details);
        refElement.appendChild(emptyDiv);

        this.lastLine = ''

        this.lastAddElement = 'alternate-list';

    }

    createDottedList(refElement, tagName){

        this.removeComand(refElement, tagName);

        let ul = document.createElement('ul');
        let emptyDiv = this.createDiv();
        let li = this.createLi();

        ul.appendChild(li);

        
        ul.classList.add(tagName.replace('/', ''));

        
        refElement.appendChild(ul);
        refElement.appendChild(emptyDiv);

        this.lastLine = ''

        this.lastAddElement = 'dotted-list';

    }
    createHeader(refElement, tagName){

        this.removeComand(refElement, tagName);

        let div = this.createDiv();

        /*div.addEventListener('keydown', e=>{
            if(e.key === 'Enter') e.preventDefault(); //STOP HERE!!
        });*/

        div.classList.add(tagName.replace('/', ''))

        refElement.appendChild(div);

        this.lastLine = '';

        this.lastAddElement = 'header';

    }

}