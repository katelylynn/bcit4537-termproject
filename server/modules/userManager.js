const DatabaseConnection = require('./db.js')

module.exports = class UserManager {

    constructor() {
        this.db = new DatabaseConnection(
            process.env.MYSQLHOST, 
            process.env.MYSQLUSER, 
            process.env.MYSQLPASSWORD, 
            process.env.MYSQLDATABASE
        )
    }

    register(req, res) {
        //
    }

    login(req, res) {
        //
    }

    getAllUsers(req, res) {
        // admins only
        this.db.query("SELECT * FROM User;", (err, obj) => {
            if (err) console.log(err)
            else res.send(JSON.stringify(obj))
        })
    }

    getUser(req, res) {
        // user gets their own info
    }

    patchUser(req, res) {
        // user updates their own info
    }


    patchUserRole(req, res) {
        // admins only
    }

    deleteUser(req, res) {
        // admins only
    }

}