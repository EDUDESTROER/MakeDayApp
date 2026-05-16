import { EmojiView } from "../view/emoji.view.js"

export class EmojiController{

    constructor(){

        this.emojiView = new EmojiView();
        this.loadMoreBtn = document.getElementById("load-more");

        this.searchTerm = '';
        this.visibleCount = 60;

        this.init();

    }

    setSearch(term){

        this.searchTerm = term;
        this.visibleCount = 60;
        this.loadEmojis();

    }

    async getEmojis(){

        const reponse = await fetch("/icons/emojis.json");

        this.allEmojis = await reponse.json()
        //console.log(this.allEmojis);

    }

    async init(){

        await this.getEmojis();
        this.loadEmojis();
        this.loadMoreBtn.addEventListener("click", () => {
            this.visibleCount += 30;
            this.loadEmojis();
        });


    }

    getFilteredEmojis(){

        if(!this.searchTerm) return Object.entries(this.allEmojis);

        return Object.entries(this.allEmojis).filter(emoji =>
            emoji[1].name.toLowerCase().includes(this.searchTerm)
        );

    }
    loadEmojis(){
        
        const filtered = this.getFilteredEmojis();
        const emojisToShow = filtered.slice(0, this.visibleCount);

       this.emojiView.cleanContainer();

        emojisToShow.forEach(emoji => {

            this.emojiView.renderEmojis(emoji);

        });

        if(this.allEmojis.length < this.visibleCount){
           this.emojiView.hiddenLoadMore(this.loadMoreBtn);
        }else{
            this.emojiView.showLoadMore(this.loadMoreBtn);
        }

    }

}