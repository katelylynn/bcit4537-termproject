const express = require('express');
const multer = require('multer');
const CarController = require('../modules/carController');
const DBController = require('../modules/dbController');
const WhisperController = require('../modules/whisperController');
const { validateCommand } = require('../helpers/whisperCommandValidator');

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

}