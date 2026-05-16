import {LoginController} from './controllers/LoginController.js';

document.addEventListener('DOMContentLoaded', startLogin);

function startLogin(){
    new LoginController();
}