export class TimeService{

    now(){
        return new Date();
    }

    locale(){
        return 'en-US';
        //navigator.languages?.[0] || navigator.language;
    }

    getCurrentHour(){
        return this.now().getHours();
    }

    getWeekday(){
        return this.now().toLocaleDateString(this.locale(), {weekday: 'long'});
    }

    getYear(){
        return this.now().toLocaleDateString(this.locale(), {year: 'numeric'});
    }

    getMonth(){
        return this.now().toLocaleDateString(this.locale(), {month: 'long'});
    }

    getDay(){
        return this.now().toLocaleDateString(this.locale(), {day: 'numeric'});
    }

    getFullDateFormated(){

        return new Intl.DateTimeFormat(this.locale(), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(this.now());

    }
    
}