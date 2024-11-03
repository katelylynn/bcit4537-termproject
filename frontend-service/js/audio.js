import { userMessages } from "../lang/en.js"

const AUDIO_SL_WAV = "audio/wav"
const AUDIO_DOT_WAV = "audio.wav"
const EVENT_MOUSE_DOWN = "mousedown"
const EVENT_MOUSE_UP = "mouseup"
const METHOD_POST = "POST"
const STATE_INACTIVE = "inactive"
const TYPE_FILE = "file"

export class AudioManager {

    constructor(recordButtonId, statusId) {
        this.recordButton = document.getElementById(recordButtonId)
        this.status = document.getElementById(statusId)

        this.addEventListeners()
    }

    addEventListeners() {
        this.recordButton.addEventListener(EVENT_MOUSE_DOWN, this.startRecording.bind(this))
        this.recordButton.addEventListener(EVENT_MOUSE_UP, this.stopRecording.bind(this))
    }

    async startRecording() {
        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.mediaRecorder = new MediaRecorder(stream)
        let audioChunks = []

        this.mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data)
        }

        this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: AUDIO_SL_WAV })
            this.sendAudioFile(audioBlob)
            this.downloadAudioFile(audioBlob)
        }

        this.mediaRecorder.start()
        this.status.innerText = userMessages.startRecording
    }

    async stopRecording() {
        // Handle button release to stop recording
        if (this.mediaRecorder && this.mediaRecorder.state !== STATE_INACTIVE) {
            this.mediaRecorder.stop()
            this.status.innerText = userMessages.stopRecording
        }
    }

    async sendAudioFile(audioBlob) {
        // Send the recorded audio file to the router
        const formData = new FormData()
        formData.append(TYPE_FILE, audioBlob, AUDIO_DOT_WAV)

        try {
            const response = await fetch('http://localhost:5001/transcribe', { // Directly to whisper-service
                method: METHOD_POST,
                body: formData,
            })

            const result = await response.json()
            this.status.innerText = userMessages.transcription(result.transcription)
        } catch (error) {
            this.status.innerText = userMessages.sendAudioError
        }
    }

    downloadAudioFile(audioBlob) {
        const url = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'audio.wav'; // Set the desired file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
    }

}