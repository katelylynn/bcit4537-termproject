const express = require("express")
const UserManager = require("./userManager")

module.exports = class DatabaseAPI {

    constructor(db) {
        this.um = new UserManager(db)
        this.app = express()
        this.app.use(express.json())
        this.app.use(this.setCorsHeaders)
        this.exposeUserRoutes()
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
        const router = express.Router()
        router.use(this.tableExistsMiddleware.bind(this))

        router.get("/", this.um.getAllUsers.bind(this.um))
        router.get("/:userId", this.um.getUser.bind(this.um))
        router.post("/", this.um.postUser.bind(this.um))
        router.patch("/:userId", this.um.patchUser.bind(this.um))
        router.patch("/change-role/:userId", this.um.patchUserRole.bind(this.um))
        router.delete("/:userId", this.um.deleteUser.bind(this.um))

        this.app.use("/users", router)
    }

    tableExistsMiddleware(req, res, next) {
        this.um.createPopulatedUserTable(err => {
            if (err) return res.status(500).send(err.message)
            next()
        })
    }

}