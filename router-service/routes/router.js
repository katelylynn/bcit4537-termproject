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
            // Only expecting transcription for now, as command won’t be returned as structured
            const {transcription, command} = await WhisperController.transcribeAudio(req.file);

            if (!command) {
                return res.status(400).json({ error: "Invalid command", transcription });
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