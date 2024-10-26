const express = require("express")
const DatabaseConnection = require('./db.js')
const Pinger = require("./ping.js")

module.exports = class ApiServer {

    constructor() {
        this.app = express()
        this.db = new DatabaseConnection(
            process.env.MYSQLHOST, 
            process.env.MYSQLUSER, 
            process.env.MYSQLPASSWORD, 
            process.env.MYSQLDATABASE
        )
        this.pinger = new Pinger()
    }

    start(port) {
        this.app.listen(port)
        this.exposeRoutes()
    }

    exposeRoutes() {
        this.app.get("/ping1", this.pinger.ping1)
        this.app.get("/ping2", this.pinger.ping2)
        this.app.get("/users", (req, res) => {
            const users = this.db.query("SELECT * FROM user;")
            console.log(users)
            res.send({ data: users })
        })
    }

}