import { EmojiView } from "/js/view/emoji.view.js";
import emojisService from "/js/services/emojis.service.js";


export class EmojiController{

    constructor(loadBtn, container, action){

        this.emojiView = new EmojiView(container, action);
        this.loadMoreBtn = loadBtn;
        this.emojiService = emojisService;

        this.searchTerm = '';
        this.visibleCount = 60;

        this.init();

    }

    setSearch(term){

        this.searchTerm = term;
        this.visibleCount = 60;
        this.loadEmojis();

    }

    async init(){

        await this.emojiService.load();

        this.loadEmojis();
        this.loadMoreBtn.addEventListener("click", () => {
            this.visibleCount += 30;
            this.loadEmojis();
        });


    }

    getFilteredEmojis(){

        if(!this.searchTerm) return Object.entries(this.emojiService.get());

        return Object.entries(this.emojiService.get()).filter(emoji =>
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

        if(this.emojiService.get().length < this.visibleCount){

           this.emojiView.hiddenLoadMore(this.loadMoreBtn);

        }else if(this.emojiService.get().length > this.visibleCount){

            this.emojiView.showLoadMore(this.loadMoreBtn);

        }

    }

}