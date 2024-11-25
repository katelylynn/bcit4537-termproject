import { Api } from "./api.js"

const REGISTER_PATH = "/register"
const LOGIN_PATH = "/login"
const LOGOUT_PATH = "/logout"
const RESULT_ELEMENT_ID = "result"

export class Auth {

    static register(email, password) {
        const body = {
            'email': email,
            'password': password
        }
        Api.postRouterService(REGISTER_PATH, body, response => {
            if (response.message) document.getElementById(RESULT_ELEMENT_ID).textContent = response.message
            if (response.statusText) document.getElementById(RESULT_ELEMENT_ID).textContent = response.statusText
        })
    }
    static login(email, password) {
        const body = {
            email: email,
            password: password,
        };
    
        Api.postRouterService(LOGIN_PATH, body, (response) => {
            if (response.message) document.getElementById(RESULT_ELEMENT_ID).textContent = response.message;
            if (response.statusText) document.getElementById(RESULT_ELEMENT_ID).textContent = response.statusText;

            if (response.role) {
                const url = response.role === "admin"
                    // ? '/frontend-service/admin.html'
                    // : "/frontend-service/landing.html";
                    ? '/admin.html'
                    : "/landing.html";

                window.location.href = url;

            } else {
                console.error("Login failed:", response.message || "Unknown error");
                document.getElementById(RESULT_ELEMENT_ID).textContent = response.message || "Login failed. Please try again.";
            }

        });
    }
    

    static forgotPassword(email) {
        console.log("todo implement forgot password")
    }

    static logout() {
        const body = {};
        Api.postRouterService(LOGOUT_PATH, body, response => {
            window.location.href = 'https://bcit4537-termproject-frontend.up.railway.app/login.html';
        });
    }

}