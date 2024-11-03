import { Auth } from "./auth.js"
import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const LOGOUT_BUTTON_ID = "logoutButton"

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
