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
    internalServerError: "Internal Server Error",
    noTokenProvided: "Unauthorized: No token provided",
    invalidToken: "Unauthorized: Invalid token",
    notAnAdmin: "Unauthorized: Not an admin",
    unknownError: "Unknown error",
    landingPageFail: "Failed to load the landing page",
    extractContentFail: "Failed to extract content",
    adminPageFail: "Failed to load the admin page",
    docPageFail: "Failed to load the docs",
};

const VALID_COMMANDS = {
    "forward": "/forward",
    "backward": "/backward",
    "stop": "/stop",
    "rotate": "/rotate",
};

const WARNING_MESSAGES = {
    consumptionLimit: "Warning! You have passed the 20 free API calls limit.",
}

const WORD_TO_NUMBER = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10
};

module.exports = { ERROR_MESSAGES, VALID_COMMANDS, WARNING_MESSAGES, WORD_TO_NUMBER };
