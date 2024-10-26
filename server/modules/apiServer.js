const express = require("express")
const UserManager = require("./userManager.js")

module.exports = class ApiServer {

    constructor() {
        this.app = express()
        this.userManager = new UserManager()
    }

    start(port) {
        this.app.listen(port)
        this.exposeRoutes()
    }

    exposeRoutes() {
        this.app.post("/register", this.userManager.register)
        this.app.post("/login", this.userManager.login)
        this.app.get("/users", this.userManager.getAllUsers)
        this.app.get("/users/:userId", this.userManager.getUser)
        this.app.patch("/users/:userId", this.userManager.patchUser)
        this.app.patch("/users/change-role/:userId", this.userManager.patchUserRole)
        this.app.delete("/users/:userId", this.userManager.deleteUser)
    }

}