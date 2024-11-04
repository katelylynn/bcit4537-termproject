import { Initializer } from "./initializer.js";
import WavEncoder from "./libs/wav-encoder.js";

const GET_ALL_USERS_BUTTON_ID = "getAllUsersButton"

class Landing {

    constructor(getAllUsersButtonId) {
        document.getElementById(getAllUsersButtonId).onclick = this.getAllUsers
    }

    // temp, testing calling the server
    getAllUsers() {
        fetch("https://bcit4537-termproject-database.up.railway.app/users")
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))
    }

}

document.addEventListener("DOMContentLoaded", () => {
    Initializer.loadUserMessages();
    new Landing(GET_ALL_USERS_BUTTON_ID)
    
    const recordButton = document.getElementById('recordButton');
    const status = document.getElementById('status');
    let mediaRecorder;
    let audioChunks = [];

    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    } else {
        console.warn("Web Speech API is not supported in this browser.");
    }

    recordButton.addEventListener('click', async () => {
        if (recognition) {
            recognition.start();
            status.innerText = "Recording and transcribing...";

            recognition.onresult = (event) => {
                const transcription = event.results[0][0].transcript;
                console.log("Client-side transcription:", transcription);
                status.innerText = `Client-side transcription: ${transcription}`;
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                status.innerText = `Error in transcription: ${event.error}`;
            };

            recognition.onend = () => {
                status.innerText = "Transcription completed on client-side.";
            };
        }

        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks);
            const arrayBuffer = await audioBlob.arrayBuffer();

            // Create an AudioContext with 16kHz sample rate
            const audioContext = new AudioContext({ sampleRate: 16000 });
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Encode PCM data to WAV format with WavEncoder
            const wavData = await WavEncoder.encode({
                sampleRate: 16000, // Ensure this matches the AudioContext sample rate
                channelData: [audioBuffer.getChannelData(0)]  // mono channel data
            });

            const wavBlob = new Blob([wavData], { type: "audio/wav" });

            try {
                // Send the encoded WAV file to the server for transcription
                await sendAudioFile(wavBlob);
                console.log("Audio file sent successfully.");
            } catch (error) {
                console.error("Error occurred while sending audio file:", error);
            }
        
            // Create a download link for the encoded .wav file
            const audioUrl = URL.createObjectURL(wavBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = audioUrl;
            downloadLink.download = 'recorded_audio.wav';
            downloadLink.textContent = 'Download recorded audio';
            document.body.appendChild(downloadLink);
        };

        mediaRecorder.start();
        status.innerText = "Recording...";

        setTimeout(() => {
            if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
                status.innerText = "Recording stopped. Sending audio...";
            }
        }, 5000); // 5 seconds
    });

    async function sendAudioFile(audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');

        try {
            const response = await fetch('http://127.0.0.1:5002/transcribe', {
                method: 'POST',
                body: formData,
            });

            console.log("Fetch response:", response);

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Transcription from server:", result.transcription);
            status.innerText = `Transcription from server: ${result.transcription}`;
        } catch (error) {
            status.innerText = "Error sending audio.";
            console.error("Error:", error);
        }
    }
});
