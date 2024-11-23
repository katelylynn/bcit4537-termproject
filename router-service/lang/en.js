const ERROR_MESSAGES = {
    unauthorizedNoToken: "Unauthorized: No token provided",
    unauthorizedInvalidToken: "Unauthorized: Invalid token",
    transcriptionFailed: "Transcription failed",
    invalidCommand: "Invalid command",
    transcriptionResponseFailed: "Failed to parse transcription response",
    requestProcessFailed: "Failed to process request",
    userIdNotFound: "Unauthorized: User ID not found in token",
    endpointIdFailed: "Failed to get endpoint ID: {error}",
    incrementCallCountFailed: "Failed to increment user call count: {error}",
    noAudioFile: "No audio file uploaded.",
    carServiceError: "Car service returned status {statusCode}: {error}",
    carServiceUnknownError: "Car service returned status {statusCode}: Unknown error",
    carServiceParseError: "Failed to parse response from car service: {error}",
    carServiceRequestError: "Request error: {error}",
};

const VALID_COMMANDS = {
    "forward": "/forward",
    "backward": "/backward",
    "stop": "/stop",
    "rotate": "/rotate",
};

module.exports = { ERROR_MESSAGES, VALID_COMMANDS };
