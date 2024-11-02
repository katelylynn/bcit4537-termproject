require("dotenv").config()

module.exports = class UserManager {

    constructor(db) {
        this.db = db
    }

    getAllUsers(req, res) {
        // TODO: admins only

        this.db.query("SELECT * FROM User;", (err, obj) => {
            if (err) res.status(500).send(err.message)
            else res.send(JSON.stringify(obj))
        })
    }

    getUser(req, res) {
        const uid = req.params.userId
        
        this.db.query("SELECT * FROM User WHERE id = ?;", (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.length === 0) return res.status(404).send("User not found.")
            res.json(obj[0])
        }, [uid])
    }

    patchUser(req, res) {
        const uid = req.params.userId
        
        // allow variable number of changes to user
        const changes = req.body
        const fields = Object.keys(changes).map(field => `${field} = ?`).join(", ")
        const values = Object.values(changes)
        values.push(uid)

        this.db.query(`UPDATE User SET ${fields} WHERE id = ?;`, (err) => {
            if (err) return res.status(500).send(err.message)
            res.send("User updated successfully.")
        }, values)
    }

    patchUserRole(req, res) {
        // TODO: admins only

        const uid = req.params.userId
        const { role } = req.body

        this.db.query("UPDATE User SET role = ? WHERE id = ?;", (err) => {
            if (err) return res.status(500).send(err.message)
            res.send("User role updated successfully.")
        }, [role, uid])
    }

    deleteUser(req, res) {
        // TODO: admins only

        const uid = req.params.userId

        this.db.query("DELETE FROM User WHERE id = ?;", (err) => {
            if (err) return res.status(500).send(err.message)
            res.send("User deleted successfully.")
        }, [uid])
    }

}