import { Auth } from "./auth.js"
import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"

const DOM_CONTENT_LOADED = "DOMContentLoaded"
const DOWNLOAD_LINK_ID = "downloadLink"
const LOGOUT_BUTTON_ID = "logoutButton"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"
const USAGE_COUNT_ID = "usageCount"

class Landing {

    constructor() {
        new AudioManager(DOWNLOAD_LINK_ID, RECORD_BUTTON_ID, STATUS_ID)
    }

    updateUserStats() {
        fetch("http://localhost:3000/api/api-consumption-users/1") // UPDATE BASED ON WHOS LOGGED IN
            .then(response => {
                return response.json()
            })
            .then(data => {
                document.getElementById(USAGE_COUNT_ID).innerHTML = data.total_requests
            })
            .catch(error => {
                console.error('Error fetching data:', error.message)
            })
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    const land = new Landing()
    land.updateUserStats()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
