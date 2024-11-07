const VALID_COMMANDS = {
    "forward": "/forward",
    "backward": "/backward",
    "stop": "/stop",
    "rotate left": "/rotate",
    "rotate right": "/rotate"
};

function validateCommand(transcription) {

    const sanitizedTranscription = transcription.toLowerCase().trim().replace(/[.,!?]/g, "");

    const command = VALID_COMMANDS[sanitizedTranscription];
    return command ? { isValid: true, command } : { isValid: false, error: "Invalid command" };
}

module.exports = { validateCommand };
