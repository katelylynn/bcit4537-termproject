const mysql = require("mysql2")

module.exports = class DatabaseConnection {

    constructor(host, user, password, database = null) {
        this.con = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
        })
        this.con.connect((err) => {
            if (err) throw err
            console.log("Connected to DB")
        })
    }

    query(query, cb = (_) => {}, values = []) {
        this.con.query(query, values, function (err, result) {
            cb(err, result)
        })
    }

}
