require("dotenv").config()
const { LOGS } = require("./lang/en.js")

const DatabaseConnection = require("./modules/db")
const DatabaseAPI = require("./modules/api")

const db = new DatabaseConnection(
    process.env.MYSQLHOST, 
    process.env.MYSQLUSER, 
    process.env.MYSQLPASSWORD, 
    process.env.MYSQLDATABASE
)

const api = new DatabaseAPI(db)
console.log(LOGS.SERVER_START)
api.start(port=8080)
console.log(LOGS.SERVER_STARTED)