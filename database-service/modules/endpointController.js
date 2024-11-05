const { ENDPOINT_QUERIES, MSGS, ENDPOINT_MSGS } = require("../lang/en.js")

module.exports = class EndpointController {

    constructor(db) {
        this.db = db
    }

    createTable(cb) {
        this.db.query(ENDPOINT_QUERIES.CREATE_ENDPOINT_TABLE, cb)
    }

    getAllEndpoints(req, res) {
        this.db.query(ENDPOINT_QUERIES.GET_ALL_ENDPOINTS, (err, obj) => {
            if (err) res.status(500).send(err.message)
            else res.send(JSON.stringify(obj))
        })
    }

    postEndpoint(req, res) {
        const { method, path } = req.body

        // temp validation
        if (!method || !path) {
            return res.status(400).send(MSGS.ALL_FIELDS_REQUIRED)
        }

        this.db.query(ENDPOINT_QUERIES.INSERT_ENDPOINT, (err) => {
            if (err) return res.status(500).send(ENDPOINT_MSGS.ERROR_CREATING_ENDPOINT)
            res.send(ENDPOINT_MSGS.ENDPOINT_CREATED_SUCCESSFULLY)
        }, [method, path])
    }

}