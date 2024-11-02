import { Initializer } from "./initializer.js";

document.addEventListener("DOMContentLoaded", () => {
    Initializer.loadUserMessages();
    
    const recordButton = document.getElementById('recordButton');
    const status = document.getElementById('status');
    let mediaRecorder;
    let audioChunks = [];

    recordButton.addEventListener('mousedown', async () => {

        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendAudioFile(audioBlob);
        };

        mediaRecorder.start();
        status.innerText = "Recording...";
    });

    // Handle button release to stop recording
    recordButton.addEventListener('mouseup', () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            status.innerText = "Recording stopped. Sending audio...";
        }
    });

    // Send the recorded audio file to the router
    async function sendAudioFile(audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');

        try {
            const response = await fetch('http://localhost:3000/api/transcribe-and-control', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            status.innerText = `Transcription: ${result.transcription}`;
        } catch (error) {
            status.innerText = "Error sending audio.";
            console.error("Error:", error);
        }
    }
});
