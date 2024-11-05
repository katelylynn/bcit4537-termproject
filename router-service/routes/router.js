const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('../controllers/whisperController');
const { sendCarCommand } = require('../controllers/carController');

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
        this.router.get('/test', (req, res) => res.send("test"));
        this.router.post('/transcribe-and-control', this.upload.single('file'), this.transcribeAndControl.bind(this));
    }

    async transcribeAndControl(req, res) {
        try {
            // Step 1: Transcribe audio
    
            // Step 2: Send command to Car service
    
        } catch (error) {
            res.status(500).json({ error: "Failed to process request" });
        }
    }

}
