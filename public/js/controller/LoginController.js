import { LoginEffects } from "../effects/LoginEffects.js";

export class LoginController{

    constructor(){

        this.startBtnEventsLogin();
        this.startBtnEventsRegister();
        this._elementsInError = [];
        this.effects = new LoginEffects();
        this.inputUsername = document.querySelector('#input-username');
        this.inputPassword = document.querySelector('#input-password');
        this._type = document.querySelector('.wrapper-main').lastElementChild.id;

    }

    async loginWithUs(){

        if(this.isValidUsername(this.inputUsername.value)){

            if(this.inputPassword.value.length > 0){

                let email = this.inputUsername.value;
                let password = this.inputPassword.value;

                try{

                    const res = await fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email, password})
                    });

                    const data = await res.json();

                    if(res.ok){

                        window.location.href = data.redirectUrl;

                    }else{

                        this.error(data.gravity, data.error, '#loginErr');

                    }

                }catch{

                    this.error(10, 'Unexpected error while logging in!', '#loginErr');

                }

            }else{

                this.error(0, 'Enter a password!', this.inputPassword.id);

            }

        }else{

            this.error(0, 'Enter a valid email address or username!', this.inputUsername.id);

        }

    }

    registerWithUs(){

        let allFields = document.querySelectorAll('.input-register');

        if(this.isValidUsername(allFields[0].value)){

            if(allFields[1].value.length > 4 && allFields[2].value.length > 4){



            }else{


                
            }

        }else{

            this.error(0, 'The nickname must contain more than eight characters.', allFields[0].id);

        }

    }

    isValidUsername(field){

        //console.log(field.length > 8);

        if(field.length >= 8){

            return true;

        }else{

            return false;

        }

    }
    checkRedirect(recirectTo, btnId){

        //console.log(this._type);

        if(this._type === 'register'){

            if(recirectTo === 'redirect-login'){

                window.location.href = '/login';

            }

        }else if(this._type === 'login'){

            if(recirectTo === 'redirect-register'){

                window.location.href = '/register';

            }

        }else{

            this.error(10, 'The page type could not be found.', btnId);

        }
        
    }

    startBtnEventsLogin(){

        document.querySelectorAll('.btn-login-page').forEach(button=>{

            button.addEventListener('click', e=>{

                this.execBtnFuctionLogin(button.id.replace('btn-', ''), button.id);

            });

        });

    }
    startBtnEventsRegister(){

        document.querySelectorAll('.btn-register-page').forEach(button=>{

            button.addEventListener('click', e=>{

                this.execBtnFuctionRegister(button.id.replace('btn-', ''), button.id);

            });

        });

    }

    execBtnFuctionLogin(btnName, id){

        switch(btnName){

            case 'login':
                this.loginWithUs();
            break;
            case 'login-with-google':
                this.error(0, `Logging in with Google is unavailable.`, id);
            break;
            case 'login-with-apple':
                this.error(0, `Logging in with Apple is unavailable.`, id);
            break;
            case 'redirect-login':
                this.checkRedirect(btnName, id);
            break;
            case 'redirect-register':
                this.checkRedirect(btnName, id);
            break;
            case 'x':
                this.error(0, `It's not possible to go to our page on X.`, id);
            break;
            case 'linkedin':
                this.error(0, `It's not possible to go to our page on linkedin.`, id);
            break;
            case 'instagram':
                this.error(0, `It's not possible to go to our page on instagram.`, id);
            break;
            case 'facebook':
                this.error(0, `It's not possible to go to our page on facebook.`, id);
            break;
            default:
                this.error(10, `An unknown error has occurred.`, id);

        }

    }

    execBtnFuctionRegister(btnName, id){

        console.log(btnName);

        switch(btnName){

            case 'sign-up':
                this.registerWithUs();
            break;
            case 'register-with-google':
                this.error(0, `Register with Google is unavailable.`, id);
            break;
            case 'register-with-apple':
                this.error(0, `Register with Apple is unavailable.`, id);
            break;
            default:
                this.error(10, `An unknown error has occurred.`, id);

        }

    }

    error(gravity, msg, elId){

        if(gravity === 0){

            this.effects.showErrMsg(msg, 'warn');
            this._elementsInError.push(elId);

        }
        if(gravity === 10){

            this.effects.showErrMsg(msg, 'error');
            this._elementsInError.push(elId);
            
            setTimeout(()=>{

                window.location.href = '/error';

            }, 6000);

        }

    }

}