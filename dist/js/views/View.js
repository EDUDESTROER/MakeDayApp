class View {

    constructor(){

        this._calendarDivs = document.querySelector('.wrapper-calendar-month-days');

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


}