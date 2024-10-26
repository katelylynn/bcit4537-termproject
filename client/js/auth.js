export class Auth {

    constructor(registerButtonId, loginButtonId, forgotButtonId) {
        document.getElementById(registerButtonId).onclick = this.register.bind(this)
        document.getElementById(loginButtonId).onclick = this.login.bind(this)
        document.getElementById(forgotButtonId).onclick = this.forgotPassword.bind(this)
    }

    register() {
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error))
    }

    login() {
        console.log("login")
    }

    forgotPassword() {
        console.log("forgot password")
    }

}