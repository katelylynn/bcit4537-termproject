const express = require("express")
const Pinger = require("./ping.js")

module.exports = class ApiServer {

    constructor() {
        this.app = express()
        this.pinger = new Pinger()
    }

    start(port) {
        this.app.listen(port)
        this.exposeRoutes()
    }

    exposeRoutes() {
        this.app.get("/ping1", this.pinger.ping1)
        this.app.get("/ping2", this.pinger.ping2)
    }

}