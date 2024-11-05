import { Auth } from "./auth.js"
import { Initializer } from "./initializer.js"

const API_CONSUMPTION_STATS_ID = "apiConsumptionStats"
const DOM_CONTENT_LOADED = "DOMContentLoaded"
const LOGOUT_BUTTON_ID = "logoutButton"
const USER_CONSUMPTION_STATS_ID = "userConsumptionStats"

class Admin {

    static updateStats(url, stat_id) {
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

    static updateEndpointStats() {
        Admin.updateStats("http://localhost:3000/api/api-consumption-endpoints", API_CONSUMPTION_STATS_ID)
    }

    static updateUserStats() {
        Admin.updateStats("http://localhost:3000/api/api-consumption-users", USER_CONSUMPTION_STATS_ID)
    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    Admin.updateEndpointStats()
    Admin.updateUserStats()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
