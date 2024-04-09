class View {

    constructor(){

        this._calendarDivs = document.querySelector('.wrapper-calendar-month-days');
        this._allNoteTextContent;
        this.lastLine;

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
    addCalendarDivsClickEvents(month){

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
            if(one !== true && dat.innerText == new Date().getDate() && month == new Date().getMonth()){
                one = true;
                dat.id = 'calendar-today';
            }
        });

    }

    filterText(sentText){

        let tempText;

        tempText = sentText.split('\n');

        console.log(sentText);
        console.log(tempText);

        this._allNoteTextContent = tempText; //Keep here

        tempText.forEach(line=>{

            if(line !== ''){

                this.lastLine = line;

            }

        });
    }

    formatNoteContent(event, element){ 

        this.filterText(element.innerText);

        let lastLine = '';

        try {

            lastLine = this.lastLine.split(" ");

            lastLine = lastLine[lastLine.length -1];

        } catch (error) {
            
            lastLine = this.lastLine;

        }

        console.log(lastLine);
        
        switch(lastLine){

            case '/dotted-list':
                this.newMark(element, lastLine);
                break;
            case '/h1':
                this.newHeader(element, lastLine);
                break;
            case '/h2':
                this.newHeader(element, lastLine);
                break;
            case '/h3':
                this.newHeader(element, lastLine);
                break;
            case '/h4':
                this.newHeader(element, lastLine);
                break;
            case '/numbered-list':
                this.newOl(element, lastLine);
                break;
            default:
                //console.log(noteContentText);
                break;
                
        }

        //console.log(event, noteContentText.length);
    }

    whaitPressEnter(refElement){
            return new Promise((resolve, reject) => {
                refElement.addEventListener('keyup', e=>{ 
                    if(e.keyCode == 13){
                        e.preventDefault();
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            });
    }

    newMark(oldElement, comandTxt){

        this.whaitPressEnter(oldElement).then(pressEnter =>{

            //console.dir(oldElement.childNodes);

            this.removeComandText(comandTxt, oldElement);
            this.removeEmptyLastDiv(oldElement);

            let ul = document.createElement('ul');
            let li = document.createElement('li');

            ul.appendChild(li);

            let emptyDiv = document.createElement('div');

            li.innerHTML = `<br>`
            emptyDiv.innerHTML = `<br>`

            ul.classList.add('dotted-list');

            oldElement.appendChild(ul);
            oldElement.appendChild(emptyDiv);

        }).catch(pressEnter =>{

            return;

        });
    }

    newOl(oldElement, comandTxt){

        this.whaitPressEnter(oldElement).then(pressEnter =>{

            //console.dir(oldElement.childNodes);

            this.removeComandText(comandTxt, oldElement);
            this.removeEmptyLastDiv(oldElement);

            let ol = document.createElement('ol');
            let li = document.createElement('li');

            ol.appendChild(li);

            let emptyDiv = document.createElement('div');

            li.innerHTML = `<br>`
            emptyDiv.innerHTML = `<br>`

            ol.classList.add('numbered-list');

            oldElement.appendChild(ol);
            oldElement.appendChild(emptyDiv);

        }).catch(pressEnter =>{

            return;

        });
    }

    newHeader(oldElement, comandTxt){

        this.whaitPressEnter(oldElement).then(pressEnter =>{

            console.dir(oldElement.childNodes);

            this.removeComandText(comandTxt, oldElement);
            this.removeEmptyLastDiv(oldElement);

            let div = document.createElement('div');

            let emptyDiv = document.createElement('div');

            div.innerHTML = `<br>`
            emptyDiv.innerHTML = `<br>`

            div.classList.add(comandTxt.replace('/', ''));

            oldElement.appendChild(div);
            oldElement.appendChild(emptyDiv);

        }).catch(pressEnter =>{

            return;

        });
    }

    removeComandText(comandTxt, oldElement){

        console.log(comandTxt);
        console.dir(oldElement.innerHTML);

        oldElement.childNodes.forEach(child=>{
            if(child.nodeName == '#text' || child.nodeName == 'DIV'){

                child.textContent = child.textContent.replace(comandTxt , '')
                
                if(!child.textContent){
                    oldElement.removeChild(child);
                }

            }
        });

        this.lastLine = '';

    }
    removeEmptyLastDiv(element){

        element.childNodes.forEach(div =>{
            if(div.textContent == ''){
                element.removeChild(div);
            }
        });

    }
}