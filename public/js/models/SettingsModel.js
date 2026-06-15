export class SettingsModel {

    constructor(){

        this.settings = [];

    }

    set(settingsArray){

        this.settings = settingsArray;

    }
    getByKey(key) {
        return this.settings.find(s => s.key === key);
    }
    getValue(key) {
        return this.getByKey(key)?.value;
    }

    getAll() {
        return this.settings;
    }
    setValue(key, newValue) {
        const setting = this.getByKey(key);
        if (setting) {
        setting.value = newValue;
        }
    }

}