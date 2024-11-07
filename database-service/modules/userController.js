const { STATUSES, USER_QUERIES, MSGS, USER_MSGS } = require("../lang/en.js")

const ADMIN = "admin"
const USER = "user"

module.exports = class UserController {

    constructor(db) {
        this.db = db
    }

    static createTable(cb, db) {
        db.query(USER_QUERIES.CREATE_USER_TABLE, cb)
    }

    populateTable(req, res) {
        this.db.query(USER_QUERIES.INSERT_SAMPLE_USERS, (err) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: USER_QUERIES.ERROR_CREATING_USER })
            else res.json({ statusText: USER_MSGS.USER_CREATED_SUCCESSFULLY })
        })
    }

    getUserId(req, res) {
        const email = req.params.email

        this.db.query(USER_QUERIES.GET_USER_ID, (err, obj) => {
            if (err) res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj })
        }, [email])
    }

    getAllUsers(req, res) {
        this.db.query(USER_QUERIES.GET_ALL_USERS, (err, obj) => {
            if (err) res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj })
        })
    }

    getUser(req, res) {
        const uid = req.params.userId
        
        this.db.query(USER_QUERIES.GET_USER, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            res.json({ data: obj })
        }, [uid])
    }

    postUser(req, res) {
        const { email, password, role } = req.body

        if (!email || !password || !role) {
            return res.status(STATUSES.BAD_REQUEST).json(MSGS.ALL_FIELDS_REQUIRED)
        }

        this.db.query(USER_QUERIES.INSERT_USER, (err) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: USER_MSGS.ERROR_CREATING_USER })
            res.json({ statusText: USER_MSGS.USER_CREATED_SUCCESSFULLY })
        }, [email, password, role])
    }

    patchUser(req, res) {
        const uid = req.params.userId
        
        // allow variable number of changes to user
        const changes = req.body

        // prevent changing role
        if (changes.role !== undefined) {
            return res.status(STATUSES.BAD_REQUEST).json({ error: USER_MSGS.NOT_ALLOWED_TO_MODIFY_ROLE })
        }

        const fields = Object.keys(changes).map(field => `${field} = ?`).join(", ")
        const values = Object.values(changes)
        values.push(uid)

        this.db.query(USER_QUERIES.UPDATE_USER(fields), (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            res.json({ statusText: USER_MSGS.USER_UPDATED_SUCCESSFULLY })
        }, values)
    }

    patchUserRole(req, res) {
        const uid = req.params.userId
        const { role } = req.body

        if (role === undefined) {
            return res.status(STATUSES.BAD_REQUEST).json({ error: USER_MSGS.PROVIDE_ROLE })
        }

        if (role !== USER && role !== ADMIN) {
            return res.status(STATUSES.BAD_REQUEST).json({ error: USER_MSGS.ROLE_RESTRICTIONS })
        }

        this.db.query(USER_QUERIES.UPDATE_USER_ROLE, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            res.json({ statusText: USER_MSGS.USER_ROLE_UPDATED_SUCCESSFULLY })
        }, [role, uid])
    }

    deleteUser(req, res) {
        const uid = req.params.userId

        this.db.query(USER_QUERIES.DELETE_USER, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            if (obj.affectedRows === 0) return res.status(STATUSES.OK).json({ error: USER_MSGS.USER_NOT_FOUND })
            res.json({ statusText: USER_MSGS.USER_DELETED_SUCCESSFULLY })
        }, [uid])
    }

}
