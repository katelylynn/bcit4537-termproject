const express = require('express');
const multer = require('multer');
const CarController = require('../modules/carController');
const DBController = require('../modules/dbController');
const WhisperController = require('../modules/whisperController');

module.exports = class Router {

    constructor() {
        this.router = express.Router();
        this.upload = multer();
        this.exposeRoutes();
    }

    getRouter() {
        return this.router;
    }

    exposeRoutes() {
        this.router.get('/api-consumption-users', DBController.getApiConsumptionAllUsers)

        this.router.get('/test', this.transcribeAndControl.bind(this));
        this.router.post('/transcribe-and-control', this.upload.single('file'), this.transcribeAndControl.bind(this));
    }

    async transcribeAndControl(req, res) {
        try {
            const command = WhisperController.transcribeAudio();
            const success = CarController.sendCarCommand(command);
            if (success) {
                res.write("success");
                res.end();
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to process request" });
        }
    }

}
