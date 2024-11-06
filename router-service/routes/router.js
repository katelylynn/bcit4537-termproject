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
        this.router.get('/api-consumption-endpoints', DBController.getApiConsumptionAllEndpoints.bind(DBController));
        this.router.get('/api-consumption-users', DBController.getApiConsumptionAllUsers.bind(DBController));
        this.router.get('/api-consumption-users/:uid', DBController.getApiConsumptionSingleUser.bind(DBController));

        this.router.get('/test', this.transcribeAndControl.bind(this));
        this.router.post('/transcribe-and-control', this.upload.single('file'), this.transcribeAndControl.bind(this));
    }

    async transcribeAndControl(req, res) {
        try {
            const command = await WhisperController.transcribeAudio(req.file);
            
            if (!command) {
                return res.status(400).json({ error: "No transcription received" });
            }
    
            const carCommandSuccess = CarController.sendCarCommand(command);

            if (carCommandSuccess) {
                res.json({ transcription: command});
            } else {
                res.status(500).json({ error: "Failed to send command to the car" });
            }

        } catch (error) {
            res.status(500).json({ error: "Failed to process request" });
        }
    }

}
