import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const DOWNLOAD_LINK_ID = "downloadLink"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"

class Landing {

    constructor() {
        new AudioManager(DOWNLOAD_LINK_ID, RECORD_BUTTON_ID, STATUS_ID)
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    new Landing()
})
