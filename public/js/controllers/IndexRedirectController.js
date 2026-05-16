function redirectTo(address){

    const listAllowed = ['/login','/register'];
    const errorPage = '/error';

    if(listAllowed.indexOf(address) > -1){

        window.location.href = address;

    }else{

        window.location.href = errorPage;

    }

}

function addEvents(){

    const loginbtn = document.querySelector('#btn-login');
    const loginAddress = '/login';

    const registerbtn = document.querySelector('#btn-register');
    const registerAddress = '/register';

    loginbtn.addEventListener('click', e=>{

        redirectTo(loginAddress);

    });

    registerbtn.addEventListener('click', e=>{

        redirectTo(registerAddress);

    });

}

addEvents();