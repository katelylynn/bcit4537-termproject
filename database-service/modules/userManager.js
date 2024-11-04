require("dotenv").config()
const { QUERIES, USER_MSGS } = require("../lang/en.js")

module.exports = class UserManager {

    constructor(db) {
        this.db = db
    }

    createUserTable(cb) {
        this.db.query(QUERIES.CREATE_USER_TABLE, cb)
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
        const { email, password, role } = req.body;

        // temp validation
        if (!email || !password || !role) {
            return res.status(400).send(USER_MSGS.ALL_FIELDS_REQUIRED);
        }

        this.db.query(QUERIES.INSERT_USER, (err) => {
            if (err) return res.status(500).send(USER_MSGS.ERROR_CREATING_USER)
            res.send("User created successfully.")
        }, [email, password, role])
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

        this.db.query(QUERIES.UPDATE_USER(fields), (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.affectedRows === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            res.send(USER_MSGS.USER_UPDATED_SUCCESSFULLY)
        }, values)
    }

    patchUserRole(req, res) {
        // TODO: admins only

        const uid = req.params.userId
        const { role } = req.body

        if (role === undefined) {
            return res.status(400).send(USER_MSGS.PROVIDE_ROLE)
        }

        if (role !== "user" && role !== "admin") {
            return res.status(400).send(USER_MSGS.ROLE_RESTRICTIONS)
        }

        this.db.query(QUERIES.UPDATE_USER_ROLE, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.affectedRows === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            res.send(USER_MSGS.USER_ROLE_UPDATED_SUCCESSFULLY)
        }, [role, uid])
    }

    deleteUser(req, res) {
        // TODO: admins only

        const uid = req.params.userId

        this.db.query(QUERIES.DELETE_USER, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.affectedRows === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            res.send(USER_MSGS.USER_DELETED_SUCCESSFULLY)
        }, [uid])
    }

}
