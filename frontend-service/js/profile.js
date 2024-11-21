import { Api } from "./api.js"

const DELETE = "delete"
const DELETE_USER_BUTTON_ID = "deleteUserButton"
const DELETE_USER_PATH = "/user"
const EMAIL_BUTTON_ID = "emailButton"
const EMAIL_INPUT_ID = "emailInput"
const EMAIL_UPDATE_PATH = "/user/email"
const RESULT_ELEMENT_ID = "result"
const PATCH = "PATCH"

export class Profile {

    constructor() {
        document.getElementById(EMAIL_BUTTON_ID).onclick = this.updateEmail
        document.getElementById(DELETE_USER_BUTTON_ID).onclick = this.deleteUser
    }

    updateEmail() {
        Api.callRouterService(
            EMAIL_UPDATE_PATH, 
            PATCH, 
            { email: document.getElementById(EMAIL_INPUT_ID).value },
            response => {
                if (response.message) document.getElementById(RESULT_ELEMENT_ID).textContent = response.message
                if (response.statusText) document.getElementById(RESULT_ELEMENT_ID).textContent = response.statusText
            }
        )
    }

    deleteUser() {
        Api.callRouterService(
            DELETE_USER_PATH,
            DELETE,
            {},
            () => {
                window.location.href = '/login.html'
            },
        )
    }

}