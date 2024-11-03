import { Initializer } from "./initializer.js"

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
    Initializer.loadUserMessages()
    
    const recordButton = document.getElementById('recordButton')
    const status = document.getElementById('status')
    let mediaRecorder
    let audioChunks = []

    recordButton.addEventListener('mousedown', async () => {

        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(stream)
        audioChunks = []

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
            sendAudioFile(audioBlob)
        }

        mediaRecorder.start()
        status.innerText = "Recording..."
    })

    // Handle button release to stop recording
    recordButton.addEventListener('mouseup', () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop()
            status.innerText = "Recording stopped. Sending audio..."
        }
    })

    // Send the recorded audio file to the router
    async function sendAudioFile(audioBlob) {
        const formData = new FormData()
        formData.append('file', audioBlob, 'audio.wav')

        try {
            const response = await fetch('http://localhost:5001/transcribe', { // Directly to whisper-service
                method: 'POST',
                body: formData,
            })

            const result = await response.json()
            console.log("Transcription:", result.transcription)  // Log the transcription result
            status.innerText = `Transcription: ${result.transcription}`
        } catch (error) {
            status.innerText = "Error sending audio."
            console.error("Error:", error)
        }
    }

    new Landing()
})
