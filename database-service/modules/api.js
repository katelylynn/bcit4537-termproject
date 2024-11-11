const express = require("express")
const EndpointController = require("./endpointController")
const UserController = require("./userController")
const RequestController = require("./requestController")

module.exports = class DatabaseAPI {

    constructor(db) {
        this.db = db
        this.app = express()
        this.app.use(express.json())
        this.app.use(this.setCorsHeaders)
        this.exposeUserRoutes()
        this.exposeEndpointRoutes()
        this.exposeRequestRoutes()
    }
    
    start(port) {
        this.app.listen(port)
    }
    
    setCorsHeaders(req, res, next) {
        res.header("Access-Control-Allow-Origin", process.env["ACCESS-CONTROL-ALLOW-ORIGIN"])
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With")
        next()
    }

    exposeUserRoutes() {
        const uc = new UserController(this.db)

        const router = express.Router()
        router.use((_, res, next) => {
            this.tableExistsMiddleware(res, next, UserController.createTable)
        })

        router.get("/get-userid/:email", uc.getUserId.bind(uc))
        router.get("/", uc.getAllUsers.bind(uc))
        router.get("/:userId", uc.getUser.bind(uc))
        router.post("/", uc.postUser.bind(uc))
        router.patch("/:userId", uc.patchUser.bind(uc))
        router.patch("/change-role/:userId", uc.patchUserRole.bind(uc))
        router.delete("/:userId", uc.deleteUser.bind(uc))

        this.app.use("/users", router)
    }

    exposeEndpointRoutes() {
        const ec = new EndpointController(this.db)

        const router = express.Router()
        router.use((_, res, next) => {
            this.tableExistsMiddleware(res, next, EndpointController.createTable)
        })

        router.get("/get-endpointid", ec.getEndpointId.bind(ec))
        router.get("/", ec.getAllEndpoints.bind(ec))
        router.post("/", ec.postEndpoint.bind(ec))

        this.app.use("/endpoints", router)
    }

    exposeRequestRoutes() {
        const rc = new RequestController(this.db)

        const router = express.Router()
        router.use((_, res, next) => {
            this.tableExistsMiddleware(res, next, UserController.createTable)
        })
        router.use((_, res, next) => {
            this.tableExistsMiddleware(res, next, EndpointController.createTable)
        })
        router.use((_, res, next) => {
            this.tableExistsMiddleware(res, next, RequestController.createTable)
        })

        router.get("/all", rc.getAllRequests.bind(rc))
        router.get("/", rc.getRequest.bind(rc))
        router.post("/increment", rc.incrementRequest.bind(rc))
        router.get("/per-endpoint", rc.getRequestsOfAllEndpoints.bind(rc))
        router.get("/per-user", rc.getRequestsOfAllUsers.bind(rc))
        router.get("/single-user/:uid", rc.getRequestsForSingleUser.bind(rc))

        this.app.use("/requests", router)
    }

    tableExistsMiddleware(res, next, controller) {
        controller(err => {
            if (err) return res.status(500).send(err.message)
            next()
        }, this.db)
    }

}