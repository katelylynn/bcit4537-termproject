const { ENDPOINT_QUERIES } = require("../lang/en.js")

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

}