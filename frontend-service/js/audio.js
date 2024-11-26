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

        // console.log("AudioManager initialized");

        this.setupRecording();
    }

    setupRecording() {
        this.recordButton.addEventListener("click", async () => {
            // console.log("Record button clicked");

            try {
                this.status.innerText = userMessages.recording;
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (event) => {
                    // console.log("Data available from media recorder");
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = async () => {
                    // console.log("Recording stopped");
                    this.status.innerText = userMessages.recordingStopped;
                    const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    
                    // Create an AudioContext with 16kHz sample rate
                    const audioContext = new AudioContext({ sampleRate: 16000 });
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    // Encode to WAV format
                    const wavData = await WavEncoder.encode({
                        sampleRate: 16000,
                        channelData: [audioBuffer.getChannelData(0)]
                    });

                    const wavBlob = new Blob([wavData], { type: "audio/wav" });
                    
                    // Send audio file to server
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
                }, 5000);
            } catch (error) {
                // console.error("Error starting recording:", error);
                this.status.innerText = userMessages.micError;
            }
        });
    }

    async sendAudioFile(wavBlob) {
        // console.log("Sending audio file to server...");
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
                console.warn("Invalid command:", result.transcription);
                // console.log("Updating status with invalid command message");
                // this.status.innerText = `Invalid command: "${result.transcription}". Valid commands are: ${userMessages.validCommands.join(", ")}.`;
                this.status.innerText = userMessages.invalidCommand(result.transcription, VALID_COMMANDS);
                setTimeout(() => {
                    // console.log("Status element after update:", this.status.innerText);
                }, 1000);
            } else {
                // console.warn("Bad request:", result.error);
                this.status.innerText = userMessages.badRequestError(result.error);
            }
            return;
            }

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Transcription from server:", result.transcription);
            this.status.innerText = userMessages.transcription(result.transcription);
        } catch (error) {
            this.status.innerText = userMessages.audioSendError;
            console.error("Error:", error);
        }

        this.cb();
    }
}