class ViewControler {

    constructor(){
        this._usersMenu = document.querySelector('#user-menu-wrapper');
        this.initButtonEvents();

    }



    functionsBtn(value){

        switch (value){

            case 'menu-users':
                this.showElement(value);
                break;
            case 'menu-users-close':
                this.showElement(value);
                break;
            default:
                console.error(value, ' Is not a valid button')

        }

    }

    showElement(value){

        let element;

        if(value === 'menu-users' || 'menu-users-close'){
            element = this._usersMenu;
        }

        if(!element.style.display || element.style.display == 'none'){
            element.style.display = 'flex'
            console.dir(element);
        }else if(element.style.display){
            element.style.display = 'none'
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