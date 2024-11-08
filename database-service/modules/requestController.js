const { STATUSES, REQUEST_QUERIES, MSGS, REQUEST_MSGS } = require("../lang/en.js")

module.exports = class RequestController {

    constructor(db) {
        this.db = db
    }

    static createTable(cb, db) {
        db.query(REQUEST_QUERIES.CREATE_REQUEST_TABLE, cb)
    }
    
    getAllRequests(req, res) {
        this.db.query(REQUEST_QUERIES.GET_ALL_REQUESTS, (err, obj) => {
            if (err) res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj })
        })
    }

    getRequest(req, res) {
        const { userId, endpointId } = req.query

        if (!userId || !endpointId) {
            return res.status(STATUSES.BAD_REQUEST).json({ error: MSGS.ALL_FIELDS_REQUIRED })
        }

        this.db.query(REQUEST_QUERIES.GET_REQUEST, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            res.json({ data: obj })
        }, [userId, endpointId])
    }

    getRequestsOfAllEndpoints(req, res) {
        this.db.query(REQUEST_QUERIES.REQUESTS_PER_ENDPOINT, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj })
        })
    }

    getRequestsOfAllUsers(req, res) {
        this.db.query(REQUEST_QUERIES.REQUESTS_PER_USER, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj })
        })
    }

    getRequestsForSingleUser(req, res) {
        const uid = req.params.uid;

        if (!uid) {
            return res.status(STATUSES.BAD_REQUEST).json({ error: MSGS.ALL_FIELDS_REQUIRED })
        }

        this.db.query(REQUEST_QUERIES.REQUESTS_SINGLE_USER, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })
            else res.json({ data: obj})
        }, [uid])
    }
    
    incrementRequest(req, res) {
        const { userId, endpointId } = req.body

        if (!userId || !endpointId) {
            return res.status(STATUSES.BAD_REQUEST).json({ error: MSGS.ALL_FIELDS_REQUIRED })
        }

        this.db.query(REQUEST_QUERIES.GET_REQUEST, (err, obj) => {
            if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: err.message })

            if (obj.length === 0) {
                this.db.query(REQUEST_QUERIES.INSERT_REQUEST, (err) => {
                    if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: REQUEST_MSGS.ERROR_CREATING_REQUEST })
                    res.json({ statusText: REQUEST_MSGS.REQUEST_COUNT_INCREMENTED })
                }, [userId, endpointId, 1])
            } else {
                this.db.query(REQUEST_QUERIES.UPDATE_REQUEST_COUNT, (err) => {
                    if (err) return res.status(STATUSES.INTERNAL_SERVER).json({ error: REQUEST_MSGS.ERROR_INCREMENTING_REQUEST })
                    res.json({ statusText: REQUEST_MSGS.REQUEST_COUNT_INCREMENTED })
                }, [obj[0].count + 1, obj[0].id])
            } 
        }, [userId, endpointId])
    }

}