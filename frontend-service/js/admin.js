import { Auth } from "./auth.js"
import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"

const API_CONSUMPTION_STATS_ID = "apiConsumptionStats"
const DOM_CONTENT_LOADED = "DOMContentLoaded"
const DOWNLOAD_LINK_ID = "downloadLink"
const LOGOUT_BUTTON_ID = "logoutButton"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"
const USER_CONSUMPTION_STATS_ID = "userConsumptionStats"

class Admin {

    constructor() {
        new AudioManager(DOWNLOAD_LINK_ID, RECORD_BUTTON_ID, STATUS_ID)
    }

    updateStats(url, stat_id) {
        fetch(url)
            .then(response => {
                return response.json()
            })
            .then(data => {
                let jsonString = '';
                data.forEach((obj, index) => {
                    for (const [key, value] of Object.entries(obj)) {
                        jsonString += `${key.replace(/\d+/, '')}: ${value}<br>`;
                    }
                    jsonString += '<br>';
                });
                document.getElementById(stat_id).innerHTML = jsonString
            })
            .catch(error => {
                console.error('Error fetching data:', error.message)
            })
    }

    updateEndpointStats() {
        this.updateStats("http://localhost:3000/api/api-consumption-endpoints", API_CONSUMPTION_STATS_ID)
    }

    updateUserStats() {
        this.updateStats("http://localhost:3000/api/api-consumption-users", USER_CONSUMPTION_STATS_ID)
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    const admin = new Admin()
    admin.updateEndpointStats()
    admin.updateUserStats()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
