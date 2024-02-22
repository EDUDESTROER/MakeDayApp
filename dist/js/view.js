class ViewControler {

    constructor(){
        this._usersMenu = document.querySelector('#user-menu-wrapper');
        this._wrapperCategories = document.querySelector('.wrapper-categories');
        this.initButtonEvents();

    }



    functionsBtn(value){

        switch(value){

            case 'menu-users':
                this.showElement(this._usersMenu);
                break;
            case 'menu-bar':
                if(!this._wrapperCategories.style.display){
                    this._wrapperCategories.style.display = "flex";
                }
                this.showElement(this._wrapperCategories);
                break;
            case 'menu-users-close':
                this.showElement(this._usersMenu);
                break;
            default:
                console.error(value, ' Is not a valid button')

        }

    }

    showElement(element){

        if (element.style.display ==  "none" || !element.style.display){

            element.style.display = "flex";

        }else if (element.style.display ==  "flex"){

            element.style.display = "none";

        }

    }

    initButtonEvents(){
        let buttons = document.querySelectorAll('button');

        buttons.forEach(btn=>{
            btn.addEventListener('click', e=>{

                let textBtn = btn.id.replace("button-", "");
                if(!textBtn){
                    textBtn = btn.className.replace("button-", "");
                }

                this.functionsBtn(textBtn);

            });
        });
    }

}