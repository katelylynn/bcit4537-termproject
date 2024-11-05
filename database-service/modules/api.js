const express = require("express")
const UserController = require("./userController")

module.exports = class DatabaseAPI {

    constructor(db) {
        this.uc = new UserController(db)
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

        router.get("/", this.uc.getAllUsers.bind(this.uc))
        router.get("/:userId", this.uc.getUser.bind(this.uc))
        router.post("/", this.uc.postUser.bind(this.uc))
        router.patch("/:userId", this.uc.patchUser.bind(this.uc))
        router.patch("/change-role/:userId", this.uc.patchUserRole.bind(this.uc))
        router.delete("/:userId", this.uc.deleteUser.bind(this.uc))

        this.app.use("/users", router)
    }

    tableExistsMiddleware(req, res, next) {
        this.uc.createPopulatedUserTable(err => {
            if (err) return res.status(500).send(err.message)
            next()
        })
    }

}