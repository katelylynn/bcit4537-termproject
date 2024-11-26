/*This code was made with the assistance of CHATGPT version 4o- to:
 - make recommendations
 - provide feedback
 - correct syntax and logic
 */

import WavEncoder from "../libs/wav-encoder.js";
import { userMessages } from "../lang/en.js";

export class AudioManager {
    constructor(downloadLinkId, recordButtonId, statusId, cb = () => {}) {
        this.downloadLink = document.getElementById(downloadLinkId);
        this.recordButton = document.getElementById(recordButtonId);
        this.status = document.getElementById(statusId);
        this.audioChunks = [];
        this.mediaRecorder = null;
        this.cb = cb;
        this.setupRecording();
    }

    setupRecording() {
        this.recordButton.addEventListener("click", async () => {

            try {
                this.status.innerText = userMessages.recording;
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = async () => {
                    this.status.innerText = userMessages.recordingStopped;
                    const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    
                    const audioContext = new AudioContext({ sampleRate: 16000 });
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    const wavData = await WavEncoder.encode({
                        sampleRate: 16000,
                        channelData: [audioBuffer.getChannelData(0)]
                    });

                    const wavBlob = new Blob([wavData], { type: "audio/wav" });
                    
                    await this.sendAudioFile(wavBlob);

                    const audioUrl = URL.createObjectURL(wavBlob);
                    this.downloadLink.href = audioUrl;
                    this.downloadLink.download = 'recorded_audio.wav';
                    this.downloadLink.textContent = userMessages.downloadText;
                };

                this.mediaRecorder.start();
                this.audioChunks = [];

                setTimeout(() => {
                    if (this.mediaRecorder.state !== "inactive") {
                        this.mediaRecorder.stop();
                    }
                }, 3000);
            } catch (error) {
                this.status.innerText = userMessages.micError;
            }
        });
    }

    async sendAudioFile(wavBlob) {
        const formData = new FormData();
        formData.append('file', wavBlob, 'audio.wav');

        try {
            const response = await fetch('https://hjdjprojectvillage.online/router-service/api/v1/transcribe-and-control', {
                method: 'POST',
                body: formData,
                credentials: 'include', 
            });
            
            if (response.status === 400) {
                const result = await response.json();

                if (result.errorType === "invalid_command") {
                this.status.innerText = userMessages.invalidCommand(result.transcription, userMessages.validCommands);
            } else {
                this.status.innerText = userMessages.badRequestError(result.error);
            }
            return;
            }

            if (!response.ok) {
                throw new Error(`${userMessages.serverError} ${response.statusText}`);
            }

            const result = await response.json();
            this.status.innerText = userMessages.transcription(result.transcription);
        } catch (error) {
            this.status.innerText = userMessages.audioSendError;
        }
        this.cb();
    }
}