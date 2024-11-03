import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const GET_ALL_USERS_BUTTON_ID = "getAllUsersButton"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"

class Landing {

    constructor(getAllUsersButtonId, recordButtonId, statusId) {
        new AudioManager(recordButtonId, statusId)
        document.getElementById(getAllUsersButtonId).onclick = this.getAllUsers
    }

    // temp, testing calling the server
    getAllUsers() {
        fetch("https://bcit4537-termproject-database.up.railway.app/users")
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    new Landing(GET_ALL_USERS_BUTTON_ID, RECORD_BUTTON_ID, STATUS_ID)
})
