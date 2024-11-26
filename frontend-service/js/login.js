import { Auth } from "./auth.js"
import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const EMAIL_INPUT_ID = "emailInput"
const LOGIN_BUTTON_ID = "loginButton"
const PASSWORD_INPUT_ID = "passwordInput"
const REGISTER_BUTTON_ID = "registerButton"

class Login {
    // Proxy for Auth class that specifically handles input and button events.

    constructor() {
        document.getElementById(REGISTER_BUTTON_ID).onclick = this.register
        document.getElementById(LOGIN_BUTTON_ID).onclick = this.login
    }

    register() {
        Auth.register(
            document.getElementById(EMAIL_INPUT_ID).value,
            document.getElementById(PASSWORD_INPUT_ID).value
        )
    }

    login() {
        Auth.login(
            document.getElementById(EMAIL_INPUT_ID).value,
            document.getElementById(PASSWORD_INPUT_ID).value
        )
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    new Login()
})