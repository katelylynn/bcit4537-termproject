require("dotenv").config()
const { QUERIES, USER_MSGS } = require("../lang/en.js")

module.exports = class UserManager {

    constructor(db) {
        this.db = db
    }

    getAllUsers(req, res) {
        // TODO: admins only

        this.db.query(QUERIES.GET_ALL_USERS, (err, obj) => {
            if (err) res.status(500).send(err.message)
            else res.send(JSON.stringify(obj))
        })
    }

    getUser(req, res) {
        const uid = req.params.userId
        
        this.db.query(QUERIES.GET_USER, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.length === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            res.json(obj[0])
        }, [uid])
    }

    postUser(req, res) {
        const { name, role } = req.body;

        // temp validation
        if (!name || !role) {
            return res.status(400).send(USER_MSGS.ALL_FIELDS_REQUIRED);
        }

        this.db.query(QUERIES.INSERT_USER, (err) => {
            if (err) return res.status(500).send(USER_MSGS.ERROR_CREATING_USER)
            res.send("User created successfully.")
        }, [name, role])
    }

    patchUser(req, res) {
        const uid = req.params.userId
        
        // allow variable number of changes to user
        const changes = req.body

        // prevent changing role
        if (changes.role !== undefined) {
            return res.status(400).send(USER_MSGS.NOT_ALLOWED_TO_MODIFY_ROLE);
        }

        const fields = Object.keys(changes).map(field => `${field} = ?`).join(", ")
        const values = Object.values(changes)
        values.push(uid)

        this.db.query(QUERIES.UPDATE_USER.replace('?', fields), (err) => {
            if (err) return res.status(500).send(err.message)
            res.send(USER_MSGS.USER_UPDATED_SUCCESSFULLY)
        }, values)
    }

    patchUserRole(req, res) {
        // TODO: admins only

        const uid = req.params.userId
        const { role } = req.body

        this.db.query(QUERIES.UPDATE_USER_ROLE, (err) => {
            if (err) return res.status(500).send(err.message)
            res.send(USER_MSGS.USER_ROLE_UPDATED_SUCCESSFULLY)
        }, [role, uid])
    }

    deleteUser(req, res) {
        // TODO: admins only

        const uid = req.params.userId

        this.db.query(QUERIES.DELETE_USER, (err) => {
            if (err) return res.status(500).send(err.message)
            res.send(USER_MSGS.USER_DELETED_SUCCESSFULLY)
        }, [uid])
    }

}
