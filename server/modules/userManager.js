module.exports = class UserManager {

    constructor() {
        console.log("pinger set up")
    }

    register(req, res) {
        //
    }

    login(req, res) {
        //
    }

    getAllUsers(req, res) {
        // admins only
        this.app.get("/users", (req, res) => {
            this.db.query("SELECT * FROM User;", (err, obj) => {
                if (err) console.log(err)
                else res.send(JSON.stringify(obj))
            })
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