import { Auth } from "./auth.js"
import { Initializer } from "./initializer.js"

document.addEventListener("DOMContentLoaded", () => {
    Initializer.loadUserMessages()
    new Auth()
})