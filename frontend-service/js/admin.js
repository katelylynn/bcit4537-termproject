import { Api } from "./api.js"
import { Auth } from "./auth.js"
import { AudioManager } from "./audio.js"
import { Initializer } from "./initializer.js"
import { Profile } from "./profile.js"
import { userMessages } from "../lang/en.js"

const API_CONSUMPTION_STATS_ID = "apiConsumptionStats"
const DOWNLOAD_LINK_ID = "downloadLink"
const ENDPOINTS_PATH = "/api-consumption-endpoints"
const LOGOUT_BUTTON_ID = "logoutButton"
const RECORD_BUTTON_ID = "recordButton"
const STATUS_ID = "status"
const USER_CONSUMPTION_STATS_ID = "userConsumptionStats"
const USERS_PATH = "/api-consumption-users"
const ADMIN_CONTENT_URL = "https://hjdjprojectvillage.online/router-service/api/v1/admin";

class Admin {

    constructor() {
        new AudioManager(DOWNLOAD_LINK_ID, RECORD_BUTTON_ID, STATUS_ID)
    }

    updateStats(data, stat_id) {
        if (!data || data.length === 0) return;

        const tableBody = document.getElementById(stat_id).querySelector('tbody');
        tableBody.innerHTML = '';
    
        data.forEach(item => {
            const row = document.createElement('tr');
            
            Object.entries(item).forEach(([key, value]) => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });
    
            tableBody.appendChild(row);
        });
    }    

    updateEndpointStats() {
        Api.getRouterService(ENDPOINTS_PATH, res => {
            if (res.data.length) this.updateStats(res.data, API_CONSUMPTION_STATS_ID)
        })
    }

    updateUserStats() {
        Api.getRouterService(USERS_PATH, res => {
            if (res.data.length) this.updateStats(res.data, USER_CONSUMPTION_STATS_ID)
        })
    }

}

document.addEventListener("DOMContentLoaded", () => {
    fetch(ADMIN_CONTENT_URL, {
        method: "GET",
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`${userMessages.adminContentFail}: ${response.statusText}`);
            }
            return response.text();
        })
        .then((content) => {
            const adminContent = document.getElementById("admin-content");
            adminContent.textContent = ""; 

            const parser = new DOMParser();
            const doc = parser.parseFromString(content, "text/html");
            Array.from(doc.body.childNodes).forEach((node) => {
                adminContent.appendChild(node.cloneNode(true));
            });

            Initializer.loadUserMessages();
            new Profile();
            const admin = new Admin();
            admin.updateEndpointStats();
            admin.updateUserStats();

            document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout;
        })
        .catch((error) => {
            console.error(userMessages.adminContentFail, error.message);
            const adminContent = document.getElementById("admin-content");
            adminContent.textContent = userMessages.adminContentFail;
        });
})
