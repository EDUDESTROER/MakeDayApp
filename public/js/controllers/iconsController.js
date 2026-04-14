export class IconsController{

    constructor(){

        this.page = 1;
        this.currentType = "solid";
        this.container = document.querySelector('.new-note-icons');
        this.loadMoreBtn = document.getElementById("load-more");
        this.loading = false;
        this.readRegular = false;

        this.init();
        
    }

    init(){

        this.loadIcons();
        this.loadMoreBtn.addEventListener("click", () => this.loadIcons());
        //this.initInfiniteScroll();

    }

    async loadIcons(){

        if (this.loading) return;
        this.loading = true;

        const res = await fetch(`/icons?type=${this.currentType}&page=${this.page}&limit=30`);
        const icons = await res.json();

        if(!this.container) return;

        //console.log(icons.length, this.currentType);

        if(icons.length == 0 && !this.readRegular) {
            this.currentType = "regular";
            this.page = 1;
            this.readRegular = true;
        }

        icons.forEach(icon => {

            const btn = document.createElement("button");
            btn.className = 'btn-new-note-icons buttuns-purple-style';
            btn.dataset.action = 'select-new-note-icon';
            btn.dataset.style = icon.style;
            btn.dataset.icon = icon.name;
            
            const i = document.createElement("i");
            i.className = `${icon.style} fa-${icon.name}`;

            btn.appendChild(i);

            this.container.appendChild(btn);

        });

        this.page++;
        this.loading = false;

    }
    resetIcon(){
        
    }
    /*initInfiniteScroll() {
        const sentinel = document.getElementById("scroll-sentinel");

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
            this.loadIcons();
            }
        }, {
            root: null,
            threshold: 1.0
        });

        observer.observe(sentinel);
    }*/

}