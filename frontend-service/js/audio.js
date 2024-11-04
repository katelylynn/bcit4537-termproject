import WavEncoder from "../libs/wav-encoder.js"

export class AudioManager {

    constructor(downloadLinkId, recordButtonId, statusId) {
        this.checkWebSpeechSupport()
        this.downloadLink = document.getElementById(downloadLinkId)
        this.status = document.getElementById(statusId)
        document.getElementById(recordButtonId).addEventListener('click', this.buttonClick.bind(this))
    }

    checkWebSpeechSupport() {
        // Check for Web Speech API support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        let recognition
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition()
            this.recognition.lang = 'en-US'
            this.recognition.interimResults = false
            this.recognition.maxAlternatives = 1
        } else {
            console.warn("Web Speech API is not supported in this browser.")
        }
    }

    async buttonClick() {
        if (this.recognition) {
            this.recognition.start()
            this.status.innerText = "Recording and transcribing..."

            this.recognition.onresult = (event) => {
                const transcription = event.results[0][0].transcript
                console.log("Client-side transcription:", transcription)
                this.status.innerText = `Client-side transcription: ${transcription}`
            }

            this.recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error)
                this.status.innerText = `Error in transcription: ${event.error}`
            }

            this.recognition.onend = () => {
                this.status.innerText = "Transcription completed on client-side."
            }
        }

        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.mediaRecorder = new MediaRecorder(stream)
        this.audioChunks = []

        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data)
        }

        this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks)
            const arrayBuffer = await audioBlob.arrayBuffer()

            // Create an AudioContext with 16kHz sample rate
            const audioContext = new AudioContext({ sampleRate: 16000 })
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

            // Encode PCM data to WAV format with WavEncoder
            const wavData = await WavEncoder.encode({
                sampleRate: 16000, // Ensure this matches the AudioContext sample rate
                channelData: [audioBuffer.getChannelData(0)]  // mono channel data
            })

            const wavBlob = new Blob([wavData], { type: "audio/wav" })

            // Send the encoded WAV file to the server for transcription
            this.sendAudioFile(wavBlob)
        
            // Create a download link for the encoded .wav file
            const audioUrl = URL.createObjectURL(wavBlob)
            this.downloadLink.textContent = 'Download recorded audio'
            this.downloadLink.href = audioUrl
            this.downloadLink.download = 'recorded_audio.wav'
        }

        this.mediaRecorder.start()
        this.status.innerText = "Recording..."

        setTimeout(() => {
            if (this.mediaRecorder.state !== "inactive") {
                this.mediaRecorder.stop()
                this.status.innerText = "Recording stopped. Sending audio..."
            }
        }, 5000) // 5 seconds
    }

    async sendAudioFile(audioBlob) {
        const formData = new FormData()
        formData.append('file', audioBlob, 'audio.wav')

        try {
            const response = await fetch('http://localhost:5001/transcribe', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()
            console.log("Transcription from server:", result.transcription)
            this.status.innerText = `Transcription from server: ${result.transcription}`
        } catch (error) {
            this.status.innerText = "Error sending audio."
            console.error("Error:", error)
        }
    }

}