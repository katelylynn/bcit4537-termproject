import WavEncoder from "../libs/wav-encoder.js";

export class AudioManager {
    constructor(downloadLinkId, recordButtonId, statusId, cb = () => {}) {
        this.downloadLink = document.getElementById(downloadLinkId);
        this.recordButton = document.getElementById(recordButtonId);
        this.status = document.getElementById(statusId);
        this.audioChunks = [];
        this.mediaRecorder = null;
        this.cb = cb;

        console.log("AudioManager initialized");

        this.setupRecording();
    }

    setupRecording() {
        this.recordButton.addEventListener("click", async () => {
            console.log("Record button clicked");

            try {
                this.status.innerText = "Recording...";
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (event) => {
                    console.log("Data available from media recorder");
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = async () => {
                    console.log("Recording stopped");
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
                    this.downloadLink.textContent = 'Download recorded audio';
                    this.status.innerText = "Recording stopped. Sending audio...";
                };

                this.mediaRecorder.start();
                this.audioChunks = [];

                setTimeout(() => {
                    if (this.mediaRecorder.state !== "inactive") {
                        this.mediaRecorder.stop();
                    }
                }, 5000);
            } catch (error) {
                console.error("Error starting recording:", error);
                this.status.innerText = "Error accessing microphone";
            }
        });
    }

    async sendAudioFile(wavBlob) {
        console.log("Sending audio file to server...");
        const formData = new FormData();
        formData.append('file', wavBlob, 'audio.wav');

        try {
            const response = await fetch('http://localhost:3000/api/transcribe-and-control', {
                method: 'POST',
                body: formData,
            });
            

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Transcription from server:", result.transcription);
            this.status.innerText = `Transcription from server: ${result.transcription}`;
        } catch (error) {
            this.status.innerText = "Error sending audio.";
            console.error("Error:", error);
        }

        this.cb();
    }
}
