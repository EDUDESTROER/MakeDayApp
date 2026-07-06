import { SearchView } from "../view/search.view.js";

export class SearchController{

    constructor(){

        this.searchInput = document.getElementById('input-search');
        this.timer;

        this.searchTerm = '';
        this.maxVisibility = 60;

        this.searchView = new SearchView();

        this.init();

    }

    init(){

        this.searchInput.addEventListener('input', ()=>{
            clearTimeout(this.timer);

            this.timer = setTimeout(()=>{

                this.searchContent();

            }, 800);
        });

    }

    async searchContent(){

        const term = this.searchInput.value;

        //console.log('Content to search: ', term);

        if(term === this.searchTerm) return;

        const needSearch = this.checkIsValid(term);

        if(needSearch.isValid){

            this.searchTerm = term.trim();

            try{

                const saveTerm = this.searchTerm;

                const res = await fetch(`/search?term=${encodeURIComponent(this.searchTerm)}`);

                const resResult = await res.json(); 

                //console.log(resResult);

                if(resResult.error) throw new Error(resResult.error[0])

                this.searchView.searchWrapper.replaceChildren();

                const notesTitle = Object.values(resResult.notesTitle);
                const settings = Object.values(resResult.settings);
                const notesContent = Object.values(resResult.notesContent);

                if(notesTitle.length < 1 && settings.length < 1 && notesContent < 1){
                    this.searchView.showEmptyState(saveTerm);
                }else{
                    this.searchView.hideEmptyState();
                }

                this.searchView.renderNotesWithTitle(notesTitle);

                this.searchView.renderConfigs(settings);

                this.searchView.renderNotesWithContent(notesContent, saveTerm);


            }catch(err){

                console.log(err);

                this.searchView.logError(err);


            }

            

        }

        if(needSearch.error) this.searchView.logError(needSearch.error);

    }

    checkIsValid(term){

        if(term.trim().length < 3) return {
            isValid: false,
            error: 'Search need to contain at least 3 characters' 
        };

        if(term.length > 100) return{
            isValid: false,
            error: 'Too big search'
        };

        return {
            isValid: true
        };

    }

}