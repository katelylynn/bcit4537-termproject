const express = require("express");
const Router = require("../routes/router");
require('dotenv').config();

const API_PATH = "/api";

module.exports = class Server {

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(this.setCorsHeaders.bind(this));
        this.app.use(API_PATH, (new Router()).getRouter());
    }
    
    start(port) {
        this.app.listen(port)
    }
    
    setCorsHeaders(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*") // this.formatOrigins())
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With")
        next()
    }

    formatOrigins() {
        const services = process.env.SERVICES.split(",");

        let originStr = "";
        for (const service of services) {
            const url = process.env[service];
            if (url) originStr += url + ",";
        }
        
        return originStr.slice(0, -1);
    }

}