import { Initializer } from "./initializer.js"

const GET_ALL_USERS_BUTTON_ID = "getAllUsersButton"

class Landing {

    constructor(getAllUsersButtonId) {
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

document.addEventListener("DOMContentLoaded", () => {
    Initializer.loadUserMessages()
    new Landing(GET_ALL_USERS_BUTTON_ID)
})