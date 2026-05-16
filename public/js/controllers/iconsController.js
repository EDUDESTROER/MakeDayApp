import { IconsView } from "../view/icons.view.js";

export class IconsController{

    constructor(){

        this.iconsView = new IconsView();
        this.loadMoreBtn = document.getElementById("load-more");
        this.allIcons = [];

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

        await this.getIcons();
        this.loadIcons();
        this.loadMoreBtn.addEventListener("click", () => {
            this.visibleCount += 30;
            this.loadIcons();
        });
        //this.initInfiniteScroll();

    }

    async getIcons(){

        if(this.allIcons?.length > 0) return;

        const icons = await fetch("/icons/icons.json")
            .then(res => res.json());

        this.allIcons = [
            ...icons.solid,
            ...icons.regular
        ];

    }

    getFilteredIcons(){

        if(!this.searchTerm) return this.allIcons;

        return this.allIcons.filter(icon =>
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

        if(this.allIcons.length < this.visibleCount){
            this.iconsView.hiddenLoadMore(this.loadMoreBtn);
        }else{
            this.iconsView.showLoadMore(this.loadMoreBtn);
        }

    }

}