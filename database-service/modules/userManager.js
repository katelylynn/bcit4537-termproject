require("dotenv").config()

module.exports = class UserManager {

    constructor(db) {
        this.db = db
    }

    getAllUsers(req, res) {
        // admins only
        this.db.query("SELECT * FROM User;", (err, obj) => {
            if (err) res.send(err.message)
            else res.send(JSON.stringify(obj))
        })
    }

    getUser(req, res) {
        const uid = req.params.userId
        
        this.db.query("SELECT * FROM User WHERE id = ?;", [uid], (err, obj) => {
            if (err) return res.send(err.message)
            if (obj.length === 0) return res.status(404).send("User not found.")
            res.json(obj[0])
        })
    }

    patchUser(req, res) {
        const uid = req.params.userId
        
        // TEMP: building query dynamically until we decide which fields a user can modify
        const updates = req.body
        const fields = Object.keys(updates).map(field => `${field} = ?`).join(", ")
        const values = Object.values(updates)

        values.push(uid)

        this.db.query(`UPDATE User SET ${fields} WHERE id = ?;`, values, (err) => {
            if (err) return res.send(err.message)
            res.send("User updated successfully.")
        })
    }

    patchUserRole(req, res) {
        // admins only

        const uid = req.params.userId
        const { role } = req.body

        this.db.query("UPDATE User SET role = ? WHERE id = ?;", [role, uid], (err) => {
            if (err) return res.send(err.message)
            res.send("User role updated successfully.")
        })
    }

    deleteUser(req, res) {
        // admins only

        const uid = req.params.userId

        this.db.query("DELETE FROM User WHERE id = ?;", [uid], (err) => {
            if (err) return res.status(500).send(err.message)
            res.send("User deleted successfully.")
        })
    }

}