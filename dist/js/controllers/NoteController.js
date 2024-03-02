class NoteController {

    constructor(){

        this._calendarDate = new Date();

    }

    changeMonth(calendarup, languageup, sum){

        if(sum === true){
            this._calendarDate.setMonth(this._calendarDate.getMonth() + 1);
        }else if(sum === false){
            this._calendarDate.setMonth(this._calendarDate.getMonth() - 1);
        }


        this.formatCalendar(calendarup, languageup, false);

    }

    formatCalendar(calendar, language, calendarReset){

        if(calendarReset === true){
            this._calendarDate = new Date();
        }

        let monthYearInString = this._calendarDate.toLocaleString(language, {month: 'long', year: 'numeric'});
        
        let currentYear = this._calendarDate.getFullYear();
        let currentMonth = this._calendarDate.getMonth();

        let firstDay = new Date(currentYear, currentMonth, 0)
        let lastDay = new Date(currentYear, currentMonth + 1, 0)
        let totalDays = lastDay.getDate();
        let firstDayI = firstDay.getDay();

        //console.log(currentYear, currentMonth, firstDayI, firstDay.getDay());

        let datesHTML = '';

        for(let i = firstDayI; i > 0; i --){
            let prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
            datesHTML += `<div class="no-this-month">${prevDate.getDate()}</div>`;
        }
        for(let i = 1; i <= totalDays; i ++){
            datesHTML += `<div class="this-month">${i}</div>`
        }
        for(let i = 1; i <= 15; i++){
            let nextDate = new Date(currentYear, currentMonth + 1, i);
            datesHTML += `<div class="no-this-month">${nextDate.getDate()}</div>`;
        }

        viewControler.CreateCalendarEl(calendar,monthYearInString, datesHTML);

        let calendarDivs = document.querySelector('.wrapper-calendar-month-days');
        console.dir(calendarDivs);

        viewControler.addCalendarDivsClickEvents();
    }
    
    

}