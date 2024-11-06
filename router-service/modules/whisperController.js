const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports = class WhisperController {
    static async transcribeAudio(file) {
        try {
            const form = new FormData();
            form.append('file', file.buffer, { filename: 'audio.wav', contentType: 'audio/wav' });

            const response = await fetch(process.env.WHISPER_SERVICE + '/transcribe', {
                method: 'POST',
                body: form,
                headers: form.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Whisper service error: ${response.statusText}`);
            }

            const result = await response.json();
            return result.transcription;
        } catch (error) {
            console.error("Error in WhisperController:", error);
            throw error;
        }
    }
}