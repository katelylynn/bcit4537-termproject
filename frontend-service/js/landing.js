import { Api } from "./api.js"
import { Auth } from "./auth.js"
import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"
import { Profile } from "./profile.js"
import { CarControl } from "./carControl.js"
import { userMessages } from "../lang/en.js"

const API_USAGE_WARNING_ID = "apiUsageWarning"
const DOWNLOAD_LINK_ID = "downloadLink"
const LOGOUT_BUTTON_ID = "logoutButton"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"
const USAGE_COUNT_ID = "usageCount"
const USERS_PATH = "/api-consumption-user"
const LANDING_CONTENT_URL = "https://hjdjprojectvillage.online/router-service/api/v1/landing";


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

document.addEventListener("DOMContentLoaded", () => {
    fetch(LANDING_CONTENT_URL, {
        method: "GET",
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`${userMessages.contentLoadError} ${response.statusText}`);
            }
            return response.text();
        })
        .then((content) => {
            const mainContent = document.getElementById("main-content");
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, "text/html");

            mainContent.textContent = "";
            Array.from(doc.body.childNodes).forEach((node) => {
                mainContent.appendChild(node.cloneNode(true));
            });

            Initializer.loadUserMessages();
            new Profile();
            new CarControl();

            const land = new Landing();
            land.updateUserStats();

            document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout;
        })
        .catch((error) => {
            console.error(userMessages.contentLoadError, error.message);
            document.getElementById("main-content").textContent =
                `<p>${userMessages.contentLoadError}</p>`;
        });
})
