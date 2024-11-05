import { Auth } from "./auth.js"
import { Initializer } from "./initializer.js"

const API_CONSUMPTION_STATS_ID = "apiConsumptionStats"
const DOM_CONTENT_LOADED = "DOMContentLoaded"
const LOGOUT_BUTTON_ID = "logoutButton"
const USER_CONSUMPTION_STATS_ID = "userConsumptionStats"

class Admin {

    static updateUserStats() {
        fetch("http://localhost:3000/api/api-consumption-users")
            .then(response => {
                return response.json();
            })
            .then(data => {
                data = JSON.stringify(data)
                document.getElementById(USER_CONSUMPTION_STATS_ID).innerHTML = data
            })
            .catch(error => {
                console.error('Error fetching data:', error.message);
            });

    }

}

document.addEventListener(DOM_CONTENT_LOADED, () => {
    Initializer.loadUserMessages()
    Admin.updateUserStats()

    document.getElementById(LOGOUT_BUTTON_ID).onclick = Auth.logout
})
