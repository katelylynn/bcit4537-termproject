const mysql = require("mysql2")

module.exports = class DatabaseConnection {

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
            console.log("Connected to DB")
        })
    
        this.con.on("error", (err) => {
            if (err.code === '4031') {
                console.log("Connection lost. Reconnecting...")
                setTimeout(() => {
                    this.connect();
                }, 5000);
            } else {
                console.error("Database error:", err)
            }
        })
    }

    query(query, cb = (_) => {}, values = []) {
        this.con.query(query, values, function (err, result) {
            cb(err, result)
        })
    }

}
