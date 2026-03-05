import { LoginEffects } from "../effects/LoginEffects.js";

export class LoginController{

    constructor(){

        this.startBtnEventsLogin();
        this.startBtnEventsRegister();
        this._elementsInError = []; // Send to /error!!!
        this.effects = new LoginEffects();
        this.inputUsername = document.querySelector('#input-username');
        this.inputPassword = document.querySelector('#input-password');
        this._type = document.querySelector('.wrapper-main').lastElementChild.id;
        this._isSubmitting = false;

    }

    async loginWithUs(){

        if(!this._isSubmitting){

            this._isSubmitting = true;
            this.stopSpam();

            if(this.isValidUsername(this.inputUsername.value) || this.isValidEmail(this.inputUsername.value)){

                if(!this.isEmptyfield(this.inputPassword.value)){

                    const email = this.inputUsername.value;
                    const password = this.inputPassword.value;

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

        

    }

    async registerWithUs(){

        let allFields = document.querySelectorAll('.input-register');

        const newUser = {
            nickName: allFields[0].value,
            firstName: allFields[1].value,
            lastName: allFields[2].value,
            email: allFields[3].value,
            password: allFields[4].value,
            confirmPassword: allFields[5].value,
            terms: allFields[6].checked
        }

       if(this.isValidUsername(newUser.nickName)){

            if(this.isValidName(newUser.firstName) && this.isValidName(newUser.lastName)){
    
                if(this.isValidEmail(newUser.email)){

                    if(this.isValidPassword(newUser.password) && this.isValidPassword(newUser.password)){

                        if(newUser.password === newUser.confirmPassword){

                            if(newUser.terms){

                                try{

                                    const res = await fetch('/register', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(newUser)
                                    });

                                    const data = await res.json();

                                    if(res.ok){

                                        window.location.href = data.redirectUrl;

                                    }else{

                                        

                                        this.error(data.gravity, data.error, '#registerErr');

                                    }

                                }catch(err){

                                    this.error(10,  'Unexpected Error', '#registerErr');

                                }

                            }else{

                                this.error(0, 'You must accept the terms.', '#registerTerms');

                            }

                        }else{

                            this.error(0, 'The passwords do not match.', '#registerNmatch');

                        }

                    }else{

                        this.error(0, 'The password fields must not be empty.', '#registerPassword');

                    }

                }else{

                    this.error(0, 'Entry a valid Email.', '#registerFname');

                }

            }else{

                this.error(0, 'The First and Last Name must contain more than Two characters.','#registerLname');
                
            }

        }else{

            this.error(0, 'The nickname must contain more than eight characters.', '#registerNick');

        }

    }

    isValidUsername(field){

        //console.log(field.length > 8);
        const nickRegex = /^[a-zA-Z](?:[a-zA-Z0-9_]{2,14}[a-zA-Z0-9])$/;

        //console.log(regexName.test(field));

        if(nickRegex.test(field)) return true;

        return false;

    }

    isValidPassword(field){

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if(passwordRegex.test(field)) return true;

        return false;

    }

    isValidName(field){

        const nameRegex = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/;

        if(nameRegex.test(field)) return true;

        return false;

    }
    
    isValidEmail(field){

         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

        if(emailRegex.test(field)) return true;

        return false;

    }

    isEmptyfield(field){

        if(field.length >= 1) return false;

        return true;

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

    stopSpam(){

        setTimeout(()=> this._isSubmitting = false, 2000);

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

        //console.log(btnName);

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
        if(gravity === 5){

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