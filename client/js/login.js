import { Auth } from "./auth.js"
import { Initializer } from "./initializer.js"

const REGISTER_BUTTON_ID = "registerButton"
const LOGIN_BUTTON_ID = "loginButton"
const FORGOT_BUTTON_ID = "forgotButton"

document.addEventListener("DOMContentLoaded", () => {
    Initializer.loadUserMessages()
    new Auth(REGISTER_BUTTON_ID, LOGIN_BUTTON_ID, FORGOT_BUTTON_ID)
})