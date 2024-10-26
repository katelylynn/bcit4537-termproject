const express = require("express")
const cors = require("cors")
const UserManager = require("./userManager.js")

module.exports = class ApiServer {

    constructor() {
        this.app = express()
        this.app.use(cors())
        this.userManager = new UserManager()
    }

    start(port) {
        this.app.listen(port)
        this.exposeRoutes()
    }

    exposeRoutes() {
        this.app.post("/register", this.userManager.register.bind(this.userManager))
        this.app.post("/login", this.userManager.login.bind(this.userManager))
        this.app.get("/users", this.userManager.getAllUsers.bind(this.userManager))
        this.app.get("/users/:userId", this.userManager.getUser.bind(this.userManager))
        this.app.patch("/users/:userId", this.userManager.patchUser.bind(this.userManager))
        this.app.patch("/users/change-role/:userId", this.userManager.patchUserRole.bind(this.userManager))
        this.app.delete("/users/:userId", this.userManager.deleteUser.bind(this.userManager))
    }

}