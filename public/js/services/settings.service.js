export class SettingsService {

    constructor(){
        
    }

    async getAll(){

        const res = await fetch("/settings");

        return res.json();

    }

}