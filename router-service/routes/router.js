const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const AuthController = require('../modules/authController');
const DBController = require('../modules/dbController');
const WhisperController = require('../modules/whisperController');


module.exports = class Router {

    EXTERNAL_APIS = {
        TRANSCRIBE_AND_CONTROL: ["/transcribe-and-control", "post"],
        EXAMPLE_ENDPOINT: ["/example", "get"],
    }

    constructor() {
        this.router = express.Router();
        this.upload = multer();
        this.registerEndpoints();

        this.router.use(cookieParser())

        this.nojwt = ['/register', '/login', '/logout']
        this.router.use((req, res, next) => {
            // skip jwt verification for server-to-server calls
            // should swap to calls from recognized origin list eventually
            if (req.headers['user-agent'] === 'node') {
                return next();
            }

            if (this.nojwt.includes(req.path)) {
                return next()
            }

            this.verifyJwt(req, res, next)
        });

        this.exposeRoutes();
    }

    registerEndpoints() {
        Object.values(this.EXTERNAL_APIS).forEach(value => {
            fetch(process.env["DB-SERVICE"] + "/endpoints", {
                "method": "POST",
                "headers": {
                    'Content-Type': 'application/json'
                },
                "body": JSON.stringify({
                    method: value[1],
                    path: value[0]
                })
            })
                .catch(response => {
                    console.error("Registering endpoints: " + response.statusText);
                });
        });
    }

    getRouter() {
        return this.router;
    }

    verifyJwt(req, res, next) {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
        }

        try {
            const decoded = jwt.verify(token, process.env['JWT_SECRET_KEY'])
            req.user = decoded
            next()
        } catch (err) {
            console.error('JWT Verification Error:', err.message)
            return res.status(401).json({ message: 'Unauthorized: Invalid token' })
        }
    }

    allowAdminsOnly(req, res, next) {
        const urole = req.user.user.role;
        console.log(urole);
        if (urole == "admin") next();
        else return res.status(401).json({ message: 'Unauthorized: Not an admin' });
    }

    exposeRoutes() {
        // CLIENT FACING ENDPOINTS
        this.router.get('/api-consumption-endpoints', this.allowAdminsOnly, DBController.getApiConsumptionAllEndpoints.bind(DBController));
        this.router.get('/api-consumption-users', this.allowAdminsOnly, DBController.getApiConsumptionAllUsers.bind(DBController));
        this.router.get('/api-consumption-user', DBController.getApiConsumptionSingleUser.bind(DBController));
        
        this.router.patch('/user/email', DBController.updateEmail.bind(DBController))
        this.router.delete('/user', DBController.deleteUser.bind(DBController))

        this.router.post('/register', AuthController.registerUser.bind(AuthController));
        this.router.post('/login', AuthController.loginUser.bind(AuthController));
        this.router.post('/logout', AuthController.logoutUser.bind(AuthController));

        this.router.post(this.EXTERNAL_APIS.TRANSCRIBE_AND_CONTROL[0], this.upload.single('file'), (req, res) => {
            WhisperController.transcribeAndControl(req, res);
        });

        // SERVICE FACING ENDPOINTS
        this.router.get('/get-uid/:email', DBController.getUid.bind(DBController));
        this.router.get('/get-user/:uid', DBController.getUser.bind(DBController));
        this.router.post('/post-user', DBController.postUser.bind(DBController));
        this.router.post('/post-endpoint', DBController.postEndpoint.bind(DBController));
        
    }

};
