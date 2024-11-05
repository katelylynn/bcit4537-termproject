const { USER_QUERIES, MSGS, USER_MSGS } = require("../lang/en.js")

module.exports = class UserController {

    constructor(db) {
        this.db = db
    }

    createTable(cb) {
        this.db.query(USER_QUERIES.CREATE_USER_TABLE, cb)
    }

    populateTable(req, res) {
        this.db.query(USER_QUERIES.INSERT_SAMPLE_USERS, (err) => {
            if (err) return res.status(500).send(USER_QUERIES.ERROR_CREATING_USER)
            else res.send(USER_MSGS.USER_CREATED_SUCCESSFULLY)
        })
    }

    getUserId(req, res) {
        const email = req.params.email

        this.db.query(USER_QUERIES.GET_USER_ID, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.length === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            else res.send(JSON.stringify(obj[0]))
        }, [email])
    }

    getAllUsers(req, res) {
        // TODO: admins only

        this.db.query(USER_QUERIES.GET_ALL_USERS, (err, obj) => {
            if (err) res.status(500).send(err.message)
            else res.send(JSON.stringify(obj))
        })
    }

    getUser(req, res) {
        const uid = req.params.userId
        
        this.db.query(USER_QUERIES.GET_USER, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.length === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            res.json(obj[0])
        }, [uid])
    }

    postUser(req, res) {
        const { email, password, role } = req.body

        // temp validation
        if (!email || !password || !role) {
            return res.status(400).send(MSGS.ALL_FIELDS_REQUIRED)
        }

        this.db.query(USER_QUERIES.INSERT_USER, (err) => {
            if (err) return res.status(500).send(USER_MSGS.ERROR_CREATING_USER)
            res.send(USER_MSGS.USER_CREATED_SUCCESSFULLY)
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

        this.db.query(USER_QUERIES.UPDATE_USER(fields), (err, obj) => {
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

        this.db.query(USER_QUERIES.UPDATE_USER_ROLE, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.affectedRows === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            res.send(USER_MSGS.USER_ROLE_UPDATED_SUCCESSFULLY)
        }, [role, uid])
    }

    deleteUser(req, res) {
        // TODO: admins only

        const uid = req.params.userId

        this.db.query(USER_QUERIES.DELETE_USER, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.affectedRows === 0) return res.status(404).send(USER_MSGS.USER_NOT_FOUND)
            res.send(USER_MSGS.USER_DELETED_SUCCESSFULLY)
        }, [uid])
    }

    insertSampleUsers(cb) {
        this.db.query(USER_QUERIES.INSERT_SAMPLE_USER, cb)
    }

}
