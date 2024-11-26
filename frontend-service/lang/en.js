export const userMessages = {
    warnApiLimit: "Warning! You have passed the 20 free API calls limit.",
    recording: "Recording...",
    recordingStopped: "Recording stopped. Sending audio...",
    downloadText: "Download recorded audio",
    micError: "Error accessing microphone",
    invalidCommand: (command, validCommands) =>
        `Invalid command: "${command}".\nValid commands are:\n${validCommands.join("\n")}`,
    badRequestError: (error) => `Error: ${error}`,
    transcription: (transcription) => `Transcription from server: ${transcription}`,
    audioSendError: "Error sending audio.",
    validCommands: [
        "forward [speed] [direction]", 
        "backward [speed] [direction]", 
        "stop",
        "rotate [speed] [direction]",
        "rotate [speed] [direction]"],
}