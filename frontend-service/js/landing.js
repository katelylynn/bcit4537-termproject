import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"

class Landing {

    constructor(recordButtonId, statusId) {
        new AudioManager(recordButtonId, statusId)
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    new Landing(RECORD_BUTTON_ID, STATUS_ID)
})
