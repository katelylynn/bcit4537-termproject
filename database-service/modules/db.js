const mysql = require("mysql2")
const { LOGS } = require("../lang/en.js")

module.exports = class DatabaseConnection {

    ERR_CODE_CONNECTION_LOST = 4031

    constructor(host, user, password, database = null) {
        this.config = {
            host: host,
            user: user,
            password: password,
            database: database,
        }
        this.connect()
    }

    connect() {
        this.con = mysql.createConnection(this.config)
    
        this.con.connect((err) => {
            if (err) throw err
            console.log(LOGS.DB_CONNECTED)
        })
    
        this.con.on("error", (err) => {
            if (err.code === this.ERR_CODE_CONNECTION_LOST) {
                console.log(LOGS.DB_CONNECTION_LOST)
                setTimeout(() => {
                    this.connect();
                }, 5000);
            } else {
                console.error(LOGS.DB_ERROR, err)
            }
        })
    }

    query(query, cb = (_) => {}, values = []) {
        this.con.query(query, values, function (err, result) {
            cb(err, result)
        })
    }

}
