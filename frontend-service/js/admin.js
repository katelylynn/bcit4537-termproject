import { Api } from "./api.js"
import { Auth } from "./auth.js"
import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"

const API_CONSUMPTION_STATS_ID = "apiConsumptionStats"
const DOM_CONTENT_LOADED = "DOMContentLoaded"
const DOWNLOAD_LINK_ID = "downloadLink"
const ENDPOINTS_PATH = "/api-consumption-endpoints"
const LOGOUT_BUTTON_ID = "logoutButton"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"
const USER_CONSUMPTION_STATS_ID = "userConsumptionStats"
const USERS_PATH = "/api-consumption-users"

class Admin {

    constructor() {
        new AudioManager(DOWNLOAD_LINK_ID, RECORD_BUTTON_ID, STATUS_ID)
    }

    updateStats(data, stat_id) {
        let jsonString = '';
        data.forEach(obj => {
            for (const [key, value] of Object.entries(obj)) {
                jsonString += `${key}: ${value}<br>`;
            }
            jsonString += '<br>';
        });
        document.getElementById(stat_id).innerHTML = jsonString
    }

    updateEndpointStats() {
        Api.callRouterService(ENDPOINTS_PATH, res => {
            if (res.data) this.updateStats(res.data, API_CONSUMPTION_STATS_ID)
        })
    }

    updateUserStats() {
        Api.callRouterService(USERS_PATH, res => {
            if (res.data) this.updateStats(res.data, USER_CONSUMPTION_STATS_ID)
        })
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    const admin = new Admin()
    admin.updateEndpointStats()
    admin.updateUserStats()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
