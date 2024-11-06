const https = require('https');
const FormData = require('form-data');

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
                        if (res.statusCode === 200 && result.command) { 
                            resolve(result);
                        } else if (res.statusCode === 400) {
                            reject({ error: result.error, transcription: result.transcription, status: 400 });
                        } else {
                            reject(new Error("Unexpected response from whisper-service"));
                        }

                    } catch (error) {
                        reject(new Error("Failed to parse transcription response"));
                    }
                });
            });

            req.on('error', (error) => {
                console.error("Error in WhisperController:", error);
                reject(error);
            });

            form.pipe(req);
        });
    }
}