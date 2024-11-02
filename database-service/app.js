const DatabaseConnection = require("./modules/db")
const DatabaseAPI = require("./modules/api")

const db = new DatabaseConnection(
    process.env.MYSQLHOST, 
    process.env.MYSQLUSER, 
    process.env.MYSQLPASSWORD, 
    process.env.MYSQLDATABASE
)

const api = new DatabaseAPI(db)
console.log("Starting API Server...")
api.start(8080)
console.log("API Server Started!")