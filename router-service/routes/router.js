const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const AuthController = require('../modules/authController');
const DBController = require('../modules/dbController');
const WhisperController = require('../modules/whisperController');
const CarController = require('../modules/carController');
const path = require('path');

module.exports = class Router {

    EXTERNAL_APIS = {
        API_CONSUMPTION_ENDPOINTS: ["/api-consumption-endpoints", "get"],
        API_CONSUMPTION_USERS: ["/api-consumption-users", "get"],
        API_CONSUMPTION_USER: ["/api-consumption-user", "get"],
        UPDATE_USER_EMAIL: ["/user/email", "patch"],
        DELETE_USER: ["/user", "delete"],
        TRANSCRIBE_AND_CONTROL: ["/transcribe-and-control", "post"],
        JUSTIN_1: ["/justin1", "post"],
        JUSTIN_2: ["/justin2", "post"],
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
        if (urole == "admin") next();
        else return res.status(401).json({ message: 'Unauthorized: Not an admin' });
    }

    async getEndpointId(method, path) {
        return new Promise((resolve, reject) => {
            DBController.getEndpointId(method, path, {
                status: (code) => ({
                    json: (data) => {
                        if (code === 200 && data?.data?.length) {
                            resolve(data.data[0].id);
                        } else {
                            reject(
                                new Error(
                                    ERROR_MESSAGES.endpointIdFailed.replace("{error}", data.error || "Unknown error")
                                )
                            );
                        }
                    }
                })
            });
        });
    }
    
    async incrementUserCallCount(userId, endpointId) {
        return new Promise((resolve, reject) => {
            DBController.incrementUserCallCount(userId, endpointId, {
                status: (code) => ({
                    json: (data) => {
                        if (code === 200) {
                            resolve(data);
                        } else {
                            reject(
                                new Error(
                                    ERROR_MESSAGES.incrementCallCountFailed.replace(
                                        "{error}",
                                        data.error || "Unknown error"
                                    )
                                )
                            );
                        }
                    }
                })
            });
        });
    }

    async requestCountMiddleware(req, res, next) {
        const endpointId = await this.getEndpointId(req.method, req.url);
        const userId = req.user.user.id;
        await this.incrementUserCallCount(userId, endpointId);
        next();
    }

    exposeRoutes() {
        // CLIENT FACING ENDPOINTS
        this.router.get(this.EXTERNAL_APIS.API_CONSUMPTION_ENDPOINTS[0], [this.allowAdminsOnly, this.requestCountMiddleware.bind(this)], DBController.getApiConsumptionAllEndpoints.bind(DBController));
        this.router.get(this.EXTERNAL_APIS.API_CONSUMPTION_USERS[0], [this.allowAdminsOnly, this.requestCountMiddleware.bind(this)], DBController.getApiConsumptionAllUsers.bind(DBController));
        this.router.get(this.EXTERNAL_APIS.API_CONSUMPTION_USER[0], this.requestCountMiddleware.bind(this), DBController.getApiConsumptionSingleUser.bind(DBController));
        
        this.router.post(this.EXTERNAL_APIS.JUSTIN_1[0], this.requestCountMiddleware.bind(this), CarController.justin1.bind(CarController));
        this.router.post(this.EXTERNAL_APIS.JUSTIN_2[0], this.requestCountMiddleware.bind(this), CarController.justin2.bind(CarController))
        
        this.router.post(this.EXTERNAL_APIS.TRANSCRIBE_AND_CONTROL[0], this.upload.single('file'), (req, res) => {
            WhisperController.transcribeAndControl(req, res);
        });

        this.router.patch(this.EXTERNAL_APIS.UPDATE_USER_EMAIL[0], this.requestCountMiddleware.bind(this), DBController.updateEmail.bind(DBController))
        this.router.delete(this.EXTERNAL_APIS.DELETE_USER[0], this.requestCountMiddleware.bind(this), DBController.deleteUser.bind(DBController))

        // AUTH ENDPOINTS
        this.router.post('/register', AuthController.registerUser.bind(AuthController));
        this.router.post('/login', AuthController.loginUser.bind(AuthController));
        this.router.post('/logout', AuthController.logoutUser.bind(AuthController));

        // SERVICE FACING ENDPOINTS
        this.router.get('/get-uid/:email', DBController.getUid.bind(DBController));
        this.router.get('/get-user/:uid', DBController.getUser.bind(DBController));
        this.router.post('/post-user', DBController.postUser.bind(DBController));
        this.router.post('/post-endpoint', DBController.postEndpoint.bind(DBController));
        
        // SERVER-SIDE RENDERING
        this.router.get('/landing', (req, res) => {
            res.sendFile(path.join(__dirname, '../html', 'landing.html'));
        });
        
        this.router.get('/admin', this.allowAdminsOnly, (req, res) => {
            res.sendFile(path.join(__dirname, '../html', 'admin.html'));
        });

    }

};
