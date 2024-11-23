import { Api } from "./api.js"
import { Auth } from "./auth.js"
import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"
import { Profile } from "./profile.js"
import { userMessages } from "../lang/en.js"

const API_USAGE_WARNING_ID = "apiUsageWarning"
const DOM_CONTENT_LOADED = "DOMContentLoaded"
const DOWNLOAD_LINK_ID = "downloadLink"
const LOGOUT_BUTTON_ID = "logoutButton"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"
const USAGE_COUNT_ID = "usageCount"
const USERS_PATH = "/api-consumption-user"

class Landing {

    constructor() {
        new AudioManager(DOWNLOAD_LINK_ID, RECORD_BUTTON_ID, STATUS_ID, this.updateUserStats)
    }

    updateUserStats() {
        Api.getRouterService(USERS_PATH, res => {
            const totalRequests = res.data[0].total_requests
            if (res.data[0].warning) document.getElementById(API_USAGE_WARNING_ID).textContent = res.data[0].warning
            if (totalRequests) document.getElementById(USAGE_COUNT_ID).textContent = totalRequests
            else document.getElementById(USAGE_COUNT_ID).textContent = 0
        })
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    new Profile()

    const land = new Landing()
    land.updateUserStats()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
