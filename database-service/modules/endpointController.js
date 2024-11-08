const { STATUSES, ENDPOINT_QUERIES, MSGS, ENDPOINT_MSGS } = require("../lang/en.js")

module.exports = class EndpointController {

    constructor(db) {
        this.db = db
    }

    static createTable(cb, db) {
        db.query(ENDPOINT_QUERIES.CREATE_ENDPOINT_TABLE, cb)
    }

    getEndpointId(req, res) {
        const { method, path } = req.query

        if (!method || !path) {
            return res.status(STATUSES.INTERNAL_SERVER).json({ error: MSGS.ALL_FIELDS_REQUIRED })
        }

        this.db.query(ENDPOINT_QUERIES.GET_ENDPOINT_ID, (err, obj) => {
            if (err) res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj })
        }, [method, path])
    }

    getAllEndpoints(req, res) {
        this.db.query(ENDPOINT_QUERIES.GET_ALL_ENDPOINTS, (err, obj) => {
            if (err) res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj })
        })
    }

    postEndpoint(req, res) {
        const { method, path } = req.body

        if (!method || !path) {
            return res.status(STATUSES.INTERNAL_SERVER).json({ error: MSGS.ALL_FIELDS_REQUIRED })
        }

        this.db.query(ENDPOINT_QUERIES.INSERT_ENDPOINT, (err) => {
            if (err) res.status(STATUSES.INTERNAL_SERVER).json({ error: ENDPOINT_MSGS.ERROR_CREATING_ENDPOINT })
            res.status(STATUSES.CREATED).json({ statusText: ENDPOINT_MSGS.ENDPOINT_CREATED_SUCCESSFULLY })
        }, [method, path])
    }

}