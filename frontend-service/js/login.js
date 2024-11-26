import { Auth } from "./auth.js"
import { Initializer } from "./initializer.js"
import { userMessages } from "../lang/en.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const EMAIL_INPUT_ID = "emailInput"
const LOGIN_BUTTON_ID = "loginButton"
const PASSWORD_INPUT_ID = "passwordInput"
const REGISTER_BUTTON_ID = "registerButton"
const RESULT_ELEMENT_ID = "result"

class Login {
    constructor() {
        document.getElementById(REGISTER_BUTTON_ID).onclick = this.register
        document.getElementById(LOGIN_BUTTON_ID).onclick = this.login
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    register() {
        const email = document.getElementById(EMAIL_INPUT_ID).value
        const password = document.getElementById(PASSWORD_INPUT_ID).value

        if (!Login.validateEmail(email)) {
            document.getElementById(RESULT_ELEMENT_ID).textContent = userMessages.invalidEmailFormat
            return
        }

        Auth.register(email, password)
    }

    login() {
        const email = document.getElementById(EMAIL_INPUT_ID).value
        const password = document.getElementById(PASSWORD_INPUT_ID).value

        if (!Login.validateEmail(email)) {
            document.getElementById(RESULT_ELEMENT_ID).textContent = userMessages.invalidEmailFormat
            return
        }

        Auth.login(email, password)
    }
}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    new Login()
})
