import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
})
