const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('../controllers/whisperController');
const { sendCarCommand } = require('../controllers/carController');

const router = express.Router();
const upload = multer(); // For handling file uploads in memory

router.get('/test', (req, res) => {
    sendCarCommand()
})
router.post('/transcribe-and-control', upload.single('file'), async (req, res) => {
    try {
        // Step 1: Transcribe audio

        // Step 2: Send command to Car service

    } catch (error) {
        res.status(500).json({ error: "Failed to process request" });
    }
});

module.exports = router;
