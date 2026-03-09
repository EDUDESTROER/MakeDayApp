export class LoginEffects{

    constructor(){

        this.inputEnterEvent();
        this.addMenuEvent();
        this.addSlideBtnEvents();
        this._type = document.querySelector('.wrapper-main').lastElementChild.id;
        this.slideEvents();
        this.currentSlide = 1;
        this.slideInterval;
        this.timeoutErr;
        this.audioError = new Audio('sound/error.mp3');

    }

    addMenuEvent(){

        document.querySelector('.dropdown-btn').addEventListener('click', ()=>{

            let menu = document.querySelector('.menu-drop');

            //console.log(menu);

            menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'flex' : 'none'; 

            //console.log(menu.style.display);

        });

    }

    slideEvents(){

        let slideBars = document.querySelectorAll('.slide-bars');
        let slides =  document.querySelectorAll('.massages-content');

        this.slideInterval = setInterval(()=>{

            let activeSlide = document.querySelector('.massage-active');
            let activeBar = document.querySelector('.slide-active');

            activeSlide.firstChild.classList.remove(`typewrite-animation-msg-${this.currentSlide}`)
            activeBar.disabled = false;

            if(this.currentSlide === 4) this.currentSlide = 0;

            let nextSlideId = `msg-${this.currentSlide + 1}`;
            let nextBarId = `slide-${this.currentSlide + 1}`;


            activeSlide.classList.remove('massage-active');
            activeBar.classList.remove('slide-active');

            slideBars.forEach(child=>{

                if(child.id === nextBarId){

                    child.classList.add('slide-active');
                    child.disabled = true;

                }

            });
            slides.forEach(child=>{

                if(child.id === nextSlideId){

                    child.firstChild.classList.add(`typewrite-animation-msg-${this.currentSlide + 1}`);
                    child.classList.add('massage-active');

                }

            });

            this.currentSlide = this.currentSlide + 1;

        },12000);

    }

    inputEnterEvent(){

        let inputs = document.querySelectorAll('input');

        let position = 0;

        inputs.forEach(input=>{

            input.addEventListener('keyup', e=>{

                if(e.key === 'Enter'){

                    if(position < (inputs.length - 1)){

                        position++;

                    }else{

                        //console.log(this._type);
                        if(this._type === 'login'){

                            document.querySelector('#btn-login').click();
                            position = 0;

                        }else if(this._type === 'register'){

                            document.querySelector('#btn-sign-up').click();
                            position = 0;

                        }

                    }

                    e.preventDefault();

                    //console.log(inputs, position);

                    inputs[position].focus();

                }

            });

        });

    }
    
    changeSlide(next){

        clearInterval(this.slideInterval);

        let slideBars = document.querySelectorAll('.slide-bars');
        let slides =  document.querySelectorAll('.massages-content');

        let activeSlide = document.querySelector('.massage-active');
        let activeBar = document.querySelector('.slide-active');

        activeSlide.firstChild.classList.remove(`typewrite-animation-msg-${this.currentSlide}`)
        activeBar.disabled = false;

        activeSlide.classList.remove('massage-active');
        activeBar.classList.remove('slide-active');

        let nextSlideId = `msg-${next}`;
        let nextBarId = `slide-${next}`;

        slideBars.forEach(child=>{

            if(child.id === nextBarId){

                child.classList.add('slide-active');
                child.disabled = true;

            }

        });
        slides.forEach(child=>{

            if(child.id === nextSlideId){

                child.firstChild.classList.add(`typewrite-animation-msg-${next}`);
                child.classList.add('massage-active');

            }

        });

        this.currentSlide = parseInt(next);

        this.slideEvents();

    }

    addSlideBtnEvents(){

        document.querySelectorAll('.slide-bars').forEach(bar=>{

            bar.addEventListener('click', ()=>{

                this.changeSlide(bar.id.slice()[6])

            });

        });

    }

    showErrMsg(msg, type){

        let errorMsgEl = document.querySelector('#error-msg');
        let errorEl = document.querySelector('#error-card');
        let growBar = document.querySelector('.grow-error-bar');
        clearTimeout(this.timeoutErr);

        errorEl.style.opacity = 0;
        errorEl.style.animation = '';
        growBar.style.animation = '';
        growBar.style.width = '0px';
        errorMsgEl.innerHTML = '';

        if(type === 'warn'){

            console.warn(msg);

        }else{

            console.error(msg);

        }

        errorMsgEl.innerHTML = msg;

        errorEl.style.opacity = 100;
        errorEl.style.animation = 'appearRight 1s ease-in forwards';
        growBar.style.animation = 'typing 5s ease-in forwards';
        this.audioError.play();

        this.timeoutErr = setTimeout(()=>{

            errorEl.style.opacity = 0;
            errorEl.style.animation = '';
            growBar.style.animation = '';
            errorMsgEl.innerHTML = '';

        },5000);

    }

}