import { Api } from "./api.js"
import { Auth } from "./auth.js"
import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"
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
        Api.callRouterService(USERS_PATH, res => {
            totalRequests = res.data[0].total_requests
            if (totalRequests) document.getElementById(USAGE_COUNT_ID).innerHTML = totalRequests
            if (totalRequests >= 20) {
                document.getElementById(API_USAGE_WARNING_ID).innerHTML = userMessages.warnApiLimit
            }
        })
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    const land = new Landing()
    land.updateUserStats()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
