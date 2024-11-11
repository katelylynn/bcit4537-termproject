const { VALID_COMMANDS, ERROR_MESSAGES } = require('../lang/en');

function validateCommand(transcription) {
    const sanitizedTranscription = transcription.toLowerCase().trim().replace(/[.,!?]/g, "");
    const command = VALID_COMMANDS[sanitizedTranscription];
    return command ? { isValid: true, command } : { isValid: false, error: ERROR_MESSAGES.invalidCommand };
}

module.exports = { validateCommand };