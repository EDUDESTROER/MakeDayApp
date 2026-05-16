export class GreetingService {

    constructor(timeService){
        this.timeService = timeService;
    }

    getGreeting(){

        const hour = this.timeService.getCurrentHour();

        if(hour < 12) return 'Good morning';
        if(hour < 18) return 'Good afternoon';
        return 'Good evening';

    }

}