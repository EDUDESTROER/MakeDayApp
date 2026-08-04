class IconsService {

    constructor(){

        this.icons = [];

        this.promise = null;

        //console.trace('create a service');

    }
    async load(){

        if(this.icons.length > 0) return this.icons;

        if(this.promise) return this.promise;

        this.promise = fetch("/icons/icons.json")
            .then(res => res.json())
            .then(data =>{
                this.icons = [
                    ...data.solid,
                    ...data.regular
                ];

                return this.icons;
        });

        return this.promise;

    }

    get(){

        return this.icons;

    }

}

export default new IconsService();