const { REQUEST_QUERIES, MSGS, REQUEST_MSGS } = require("../lang/en.js")

module.exports = class RequestController {

    constructor(db) {
        this.db = db
    }

    createTable(cb) {
        this.db.query(REQUEST_QUERIES.CREATE_REQUEST_TABLE, cb)
    }
    
    getAllRequests(req, res) {
        this.db.query(REQUEST_QUERIES.GET_ALL_REQUESTS, (err, obj) => {
            if (err) res.status(500).send(err.message)
            else res.send(JSON.stringify(obj))
        })
    }

    getRequest(req, res) {
        const { userId, endpointId } = req.query

        this.db.query(REQUEST_QUERIES.GET_REQUEST, (err, obj) => {
            if (err) return res.status(500).send(err.message)
            if (obj.length === 0) return res.status(404).send(REQUEST_MSGS.REQUEST_NOT_FOUND)
            res.json(obj[0])
        }, [userId, endpointId])
    }
    
    incrementRequest(req, res) {
        const { user_id, endpoint_id } = req.body

        // temp validation
        if (!user_id || !endpoint_id) {
            return res.status(400).send(MSGS.ALL_FIELDS_REQUIRED)
        }

        this.db.query(REQUEST_QUERIES.GET_REQUEST, (err, obj) => {
            if (err) return res.status(500).send(err.message)

            if (obj.length === 0) {
                this.db.query(REQUEST_QUERIES.INSERT_REQUEST, (err) => {
                    if (err) return res.status(500).send(REQUEST_MSGS.ERROR_CREATING_REQUEST)
                    res.send(REQUEST_MSGS.REQUEST_COUNT_INCREMENTED)
                }, [user_id, endpoint_id, 1])
            } else {
                this.db.query(REQUEST_QUERIES.UPDATE_REQUEST_COUNT, (err) => {
                    if (err) return res.status(500).send(REQUEST_MSGS.ERROR_INCREMENTING_REQUEST)
                    res.send(REQUEST_MSGS.REQUEST_COUNT_INCREMENTED)
                }, [obj[0].count + 1, obj[0].id])
            } 
        }, [user_id, endpoint_id])
    }

}