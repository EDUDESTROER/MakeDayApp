export class WorkspaceView{

    constructor(){

        this.firstShow = true;
        this.menuHidden = false;
        this.focusId = '#left-side-bar';
        this.wideScreen = this.checkDevice();
        this.checkResize();

    }

    showEl(id){

        let el = document.querySelector(id);

        el.style.opacity = '100';

        el.removeAttribute('inert');

    }

    unShowEl(id){

        let el = document.querySelector(id);

        //console.log(el);

        el.style.opacity = '0';

        el.setAttribute('inert', '');

    }

    hiddenMenu(id){

        if(this.menuHidden){

            this.showEl(id);

            let el = document.querySelector(id);

            el.style.position = 'static';

            this.menuHidden = false;

        }else{

            this.unShowEl(id);

            let el = document.querySelector(id);

            el.style.position = 'absolute';

            this.menuHidden = true;

        }

    }

    checkDevice(){

        const isDesktop = window.matchMedia("(min-width: 900px)").matches;

        let result = false;

        if(isDesktop) {

            result = true; 

            if(this.firstShow || this.focusId === '#left-side-bar'){

                this.showEl('#all-note');          // change to welcome page
                this.focusId = '#all-note';        // change to welcome page

            }else{

                this.flowControl(this.focusId); 
                this.showEl('#left-side-bar');


            }

            this.firstShow = false;

        }else{

            
            this.flowControl('#left-side-bar');


        }

        this.menuHidden = true;
        this.hiddenMenu('#left-side-bar');

        return result;

    }
    checkResize(){

        const media = window.matchMedia("(min-width: 900px)");

        media.addEventListener("change", (e) => {
            
            this.wideScreen = this.checkDevice();


        });

    }

    flowControl(id){

        this.unShowEl(this.focusId);

        //console.log('Focus: ', id);

        this.showEl(`${id}`);

        //console.log('Unfocus: ', this.focusId);

        this.focusId = `${id}`;

    }

    errorLog(logElementId, error){

        let elementToLog = document.querySelector(logElementId);

        elementToLog.textContent = '';

        elementToLog.textContent = error;

    }

}