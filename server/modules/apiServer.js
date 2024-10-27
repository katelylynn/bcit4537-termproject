const express = require("express")
const cors = require("cors")
const routes = require("../routes")

module.exports = class ApiServer {

    constructor() {
        this.app = express()
        this.app.use(cors())
        routes(this.app)
    }

    start(port) {
        this.app.listen(port)
    }

}