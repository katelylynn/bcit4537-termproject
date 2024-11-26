export const userMessages = {
    warnApiLimit: "Warning! You have passed the 20 free API calls limit.",
    recording: "Recording...",
    recordingStopped: "Recording stopped. Sending audio...",
    downloadText: "Download recorded audio",
    micError: "Error accessing microphone",
    invalidCommand: (command, validCommands) =>
        `Invalid command: "${command}". Valid commands are: ${validCommands.join(", ")}.`,
    badRequestError: (error) => `Error: ${error}`,
    transcription: (transcription) => `Transcription from server: ${transcription}`,
    audioSendError: "Error sending audio.",
    validCommands: [
        "forward", 
        "backward", 
        "stop",
        "rotate left",
        "rotate right"],
}