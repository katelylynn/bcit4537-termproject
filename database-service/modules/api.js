const express = require("express")
const UserManager = require("./userManager")

module.exports = class DatabaseAPI {

    constructor(db) {
        this.um = new UserManager(db)
        this.app = express()
        this.app.use(express.json())
        this.app.use(this.setCorsHeaders)
        this.exposeRoutes()
    }
    
    start(port) {
        this.app.listen(port)
    }
    
    setCorsHeaders(_, res, next) {
        res.header("Access-Control-Allow-Origin", process.env["ACCESS-CONTROL-ALLOW-ORIGIN"])
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With")
        next()
    }

    exposeRoutes() {
        this.app.get("/users", this.um.getAllUsers.bind(this.um))
        this.app.get("/users/:userId", this.um.getUser.bind(this.um))
        this.app.post("/users", this.um.postUser.bind(this.um))
        this.app.patch("/users/:userId", this.um.patchUser.bind(this.um))
        this.app.patch("/users/change-role/:userId", this.um.patchUserRole.bind(this.um))
        this.app.delete("/users/:userId", this.um.deleteUser.bind(this.um))
    }

}