const express = require("express")
const cors = require("cors")
const routes = require("../routes")

module.exports = class ApiServer {

    constructor() {
        this.app = express()
        this.app.use(this.setCorsHeaders)
        routes(this.app)
    }
    
    start(port) {
        this.app.listen(port)
    }
    
    setCorsHeaders(_, res, next) {
        res.header("Access-Control-Allow-Origin", process.env["ACCESS-CONTROL-ALLOW-ORIGIN"]);
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
        next();
    }

}