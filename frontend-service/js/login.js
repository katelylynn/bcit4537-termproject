import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const REGISTER_BUTTON_ID = "registerButton"
const LOGIN_BUTTON_ID = "loginButton"
const FORGOT_BUTTON_ID = "forgotButton"

class Login {

    constructor(registerButtonId, loginButtonId, forgotButtonId) {
        document.getElementById(registerButtonId).onclick = this.register
        document.getElementById(loginButtonId).onclick = this.login
        document.getElementById(forgotButtonId).onclick = this.forgotPassword
    }

    register() {
        console.log("register")
    }

    login() {
        console.log("login")
    }

    forgotPassword() {
        console.log("forgot password")
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    new Login(REGISTER_BUTTON_ID, LOGIN_BUTTON_ID, FORGOT_BUTTON_ID)
})