const { ENDPOINT_QUERIES, ENDPOINT_MSGS } = require("../lang/en.js")

module.exports = class EndpointController {

    constructor(db) {
        this.db = db
    }

    createPopulatedTable(cb) {
        this.db.query(ENDPOINT_QUERIES.CREATE_ENDPOINT_TABLE, cb)
    }

    getAllEndpoints(req, res) {
        res.write("test")
        res.end()
    }

    postEndpoint(req, res) {
        const { method, path } = req.body;

        // temp validation
        if (!method || !path) {
            return res.status(400).send(ENDPOINT_MSGS.ENDPOINT_NOT_FOUND);
        }

        this.db.query(ENDPOINT_QUERIES.INSERT_ENDPOINT, (err) => {
            if (err) return res.status(500).send(ENDPOINT_MSGS.ERROR_CREATING_ENDPOINT)
            res.send(ENDPOINT_MSGS.ENDPOINT_CREATED_SUCCESSFULLY)
        }, [method, path])
    }

}