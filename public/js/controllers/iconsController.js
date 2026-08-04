import { IconsView } from "/js/view/icons.view.js";
import iconsService from "/js/services/icons.service.js";

export class IconsController{

    constructor(loadBtn, container, action){

        //console.log(loadBtn, container);

        this.iconsView = new IconsView(container, action);
        this.iconsService = iconsService;
        this.loadMoreBtn = loadBtn;

        this.searchTerm = '';
        this.visibleCount = 60;

        this.init();
        
    }

    setSearch(term){

        this.searchTerm = term;
        this.visibleCount = 60;
        this.loadIcons();

    }

    async init(){

        await this.iconsService.load();

        this.loadIcons();
        this.loadMoreBtn.addEventListener("click", () => {
            this.visibleCount += 30;
            this.loadIcons();
        });
        //this.initInfiniteScroll();

    }

    getFilteredIcons(){

        if(!this.searchTerm) return this.iconsService.get();

        return this.iconsService.get().filter(icon =>
            icon.name.toLowerCase().includes(this.searchTerm)
        );

    }

    async loadIcons(){
        
        const filtered = this.getFilteredIcons();
        const iconsToShow = filtered.slice(0, this.visibleCount);

        
        this.iconsView.cleanContainer();

        iconsToShow.forEach(icon => {

            this.iconsView.renderIcons(icon);

        });

        if(this.iconsService.get().length < this.visibleCount){

            this.iconsView.hiddenLoadMore(this.loadMoreBtn);

        }else if(this.iconsService.get().length > this.visibleCount){

            this.iconsView.showLoadMore(this.loadMoreBtn);

        }

    }

}