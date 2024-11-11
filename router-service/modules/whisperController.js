const https = require('https');
const FormData = require('form-data');
const { validateCommand } = require('../helpers/whisperCommandValidator');
const CarController = require('../modules/carController');
const DBController = require('./dbController');
const { ERROR_MESSAGES } = require('../lang/en');

module.exports = class WhisperController {
    static transcribeAudio(file) {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('file', file.buffer, { filename: 'audio.wav', contentType: 'audio/wav' });

            const options = {
                hostname: process.env.WHISPER_SERVICE.replace('https://', ''),
                path: '/transcribe',
                method: 'POST',
                headers: form.getHeaders(),
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {

                        const result = JSON.parse(data);
                        
                        if (res.statusCode === 200) {
                            resolve(result.transcription);
                        } else {
                            reject({    
                                error:  ERROR_MESSAGES.transcriptionFailed,
                                details: result.error || "Unknown error",
                                transcription: result.transcription || null
                            });
                        }   
                    } catch (error) {
                        reject(new Error(ERROR_MESSAGES.transcriptionResponseFailed));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            form.pipe(req);
        }); 
    }

    // static getEndpointId(method, path) {
    //     return DBController.getEndpointId(method, path);
    // }

        // static incrementUserCallCount(userId, endpointId) {
    //     return DBController.incrementUserCallCount(userId, endpointId);
    // }
    
    static getUserIdFromToken(req) {
        try {
            const userId = req.user?.user?.id;
            if (!userId) throw new Error('Unauthorized: User ID not found in token');
            console.log(`User ID from token: ${userId}`);
            return userId;
        } catch (error) {
            console.error("Error extracting user ID from token:", error.message);
            throw error;
        }
    }
    
    static async getEndpointId(method, path) {
        console.log(`Attempting to get endpoint ID for method: ${method}, path: ${path}`);
        return new Promise((resolve, reject) => {
            DBController.getEndpointId(method, path, {
                status: (code) => ({
                    json: (data) => {
                        if (code === 200 && data?.data?.length) {
                            console.log(`Successfully retrieved endpoint ID: ${data.data[0].id}`);
                            resolve(data.data[0].id);
                        } else {
                            console.error("Failed to get endpoint ID:", data.error || 'Unknown error');
                            reject(new Error(`Failed to get endpoint ID: ${data.error || 'Unknown error'}`));
                        }
                    }
                })
            });
        });
    }
    
    static async incrementUserCallCount(userId, endpointId) {
        console.log(`Attempting to increment call count for userId: ${userId}, endpointId: ${endpointId}`);
        return new Promise((resolve, reject) => {
            DBController.incrementUserCallCount(userId, endpointId, {
                status: (code) => ({
                    json: (data) => {
                        if (code === 200) {
                            console.log("Successfully incremented call count");
                            resolve(data);
                        } else {
                            console.error("Failed to increment user call count:", data.error || 'Unknown error');
                            reject(new Error(`Failed to increment user call count: ${data.error || 'Unknown error'}`));
                        }
                    }
                })
            });
        });
    }
    
    static async transcribeAndControl(req, res) {
        try {
            if (!req.file) {
                console.error("No audio file provided in request");
                return res.status(400).json({ error: "No audio file uploaded." });
            }
    
            console.log("Starting transcribeAndControl process");
            
            const endpointId = await this.getEndpointId('POST', '/transcribe-and-control');
            const userId = this.getUserIdFromToken(req);
            await this.incrementUserCallCount(userId, endpointId);
    
            const transcription = await this.transcribeAudio(req.file);
            console.log("Audio transcription:", transcription);
    
            const validation = validateCommand(transcription);
            if (!validation.isValid) {
                console.warn("Invalid command:", transcription);
                return res.status(400).json({
                    errorType: "invalid_command",
                    error: ERROR_MESSAGES.invalidCommand,
                    transcription
                });
            }
    
            const carCommandSuccess = CarController.sendCarCommand(transcription);
            res.json({ transcription, carCommand: carCommandSuccess ? "success" : "failure" });
        } catch (error) {
            console.error("Error in transcribeAndControl:", error.message);
            res.status(500).json({ error: ERROR_MESSAGES.requestProcessFailed });
        }
    }
    
}