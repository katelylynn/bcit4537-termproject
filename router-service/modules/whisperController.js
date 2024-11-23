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
    
    static getUserIdFromToken(req) {
        try {
            const userId = req.user?.user?.id;
            if (!userId) throw new Error(ERROR_MESSAGES.userIdNotFound);
            return userId;
        } catch (error) {
            throw error;
        }
    }
    
    static async getEndpointId(method, path) {
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
    
    static async incrementUserCallCount(userId, endpointId) {
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
    
    static async transcribeAndControl(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: ERROR_MESSAGES.noAudioFile });
            }
    
            
            const endpointId = await this.getEndpointId('POST', '/transcribe-and-control');
            const userId = this.getUserIdFromToken(req);
            await this.incrementUserCallCount(userId, endpointId);
    
            const transcription = await this.transcribeAudio(req.file);
    
            const validation = validateCommand(transcription);
            if (!validation.isValid) {
                return res.status(400).json({
                    errorType: "invalid_command",
                    error: ERROR_MESSAGES.invalidCommand,
                    transcription
                });
            }
    
            console.log("Sending car command");
            const carCommandResult = await CarController.sendCarCommand(command, params);
            console.log("Car Command Result:", carCommandResult);

            if (!carCommandResult.success) {
                return res.status(500).json({ error: carCommandResult.error });
            }

            res.json({ transcription, carCommand: "success", carResponse: carCommandResult.data });

            // const carCommandSuccess = CarController.sendCarCommand(transcription);
            // res.json({ transcription, carCommand: carCommandSuccess ? "success" : "failure" });
        } catch (error) {
            res.status(500).json({ error: ERROR_MESSAGES.requestProcessFailed });
        }
    }
}