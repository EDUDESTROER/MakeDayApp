class EmojiService {

    constructor(){

        this.emojis = [];

        this.promise = null

    }

    async load(){

        if(this.emojis.length > 0) return this.emojis;

        if(this.promise) return this.promise;

        this.promise = fetch("/icons/emojis.json")
            .then(res => res.json())
            .then(data =>{
                this.emojis = data;

                return this.emojis;

            });

        return this.promise;

    }

    get(){

        return this.emojis

    }

}

export default new EmojiService();