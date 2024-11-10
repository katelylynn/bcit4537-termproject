const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const AuthController = require('../modules/authController');
const CarController = require('../modules/carController');
const DBController = require('../modules/dbController');
const WhisperController = require('../modules/whisperController');
const { validateCommand } = require('../helpers/whisperCommandValidator');


module.exports = class Router {
    constructor() {
        this.router = express.Router();
        this.upload = multer();

        this.router.use(cookieParser())

        this.nojwt = ['/register', '/login']
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

    exposeRoutes() {
        this.router.get('/api-consumption-endpoints', DBController.getApiConsumptionAllEndpoints.bind(DBController));
        this.router.get('/api-consumption-users', DBController.getApiConsumptionAllUsers.bind(DBController));
        this.router.get('/api-consumption-users/:uid', DBController.getApiConsumptionSingleUser.bind(DBController));
        this.router.get('/get-uid/:email', DBController.getUid.bind(DBController));
        this.router.get('/get-user/:uid', DBController.getUser.bind(DBController));

        this.router.post('/post-user', DBController.postUser.bind(DBController));

        this.router.post('/register', AuthController.registerUser.bind(AuthController));
        this.router.post('/login', AuthController.loginUser.bind(AuthController));

        this.router.get('/test', this.transcribeAndControl.bind(this));
        this.router.post('/transcribe-and-control', this.upload.single('file'), this.transcribeAndControl.bind(this));
    }

    async transcribeAndControl(req, res) {
        try {
            const transcription = await WhisperController.transcribeAudio(req.file);

            const validation = validateCommand(transcription);
            if (!validation.isValid) {
                return res.status(400).json({
                    errorType: "invalid_command",
                    error: validation.error,
                    transcription
                });
            }

            // Assume the transcription is a valid command for this test
            const carCommandSuccess = CarController.sendCarCommand(transcription);
    
            // if (carCommandSuccess) {
            //     res.json({ transcription, carCommand: "success" });
            // } else {
            //     res.status(500).json({ error: "Failed to send command to the car" });
            // }

            res.json({transcription});
        } catch (error) {
            if (error.error) {
                res.status(400).json(error);
            } else {
                console.error("Error in transcribeAndControl:", error);
                res.status(500).json({ error: "Failed to process request" });
            }
        }
    }
};
