
const ERROR_MESSAGES = {
    unauthorizedNoToken: "Unauthorized: No token provided",
    unauthorizedInvalidToken: "Unauthorized: Invalid token",
    transcriptionFailed: "Transcription failed",
    invalidCommand: "Invalid command",
    transcriptionResponseFailed: "Failed to parse transcription response",
    requestProcessFailed: "Failed to process request",
};

const VALID_COMMANDS = {
    "forward": "/forward",
    "backward": "/backward",
    "stop": "/stop",
    "rotate left": "/rotate",
    "rotate right": "/rotate"
};

module.exports = { ERROR_MESSAGES, VALID_COMMANDS };