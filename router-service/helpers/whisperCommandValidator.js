// const { VALID_COMMANDS, ERROR_MESSAGES } = require('../lang/en');

// function validateCommand(transcription) {
//     const sanitizedTranscription = transcription.toLowerCase().trim().replace(/[.,!?]/g, "");
//     const command = VALID_COMMANDS[sanitizedTranscription];
//     return command ? { isValid: true, command } : { isValid: false, error: ERROR_MESSAGES.invalidCommand };
// }

// module.exports = { validateCommand };

const { VALID_COMMANDS, ERROR_MESSAGES } = require('../lang/en');

function validateCommand(transcription) {
    const sanitizedTranscription = transcription.toLowerCase().trim().replace(/[.,!?]/g, "");
    const [command, ...args] = sanitizedTranscription.split(" ");

    if (!VALID_COMMANDS[command]) {
        return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
    }

    const result = { isValid: true, command: VALID_COMMANDS[command], params: {} };

    switch (command) {
        case "forward": 
        case "backward":
            if (args.length !== 2) {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            const [speed, angle] = args.map(Number);
            if (!isValidSpeed(speed) || !isValidAngle(angle)) {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            result.params = { speed, angle };
            break;

        case "rotate":
            if (args.length !== 2) {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            const [rotateSpeed, direction] = [Number(args[0]), args[1]];
            if (!isValidSpeed(rotateSpeed) || !isValidDirection(direction)) {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            result.params = { speed: rotateSpeed, direction };
            break;

        case "stop":
            if (args.length !== 0) {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            break;

        default:
            return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
    }

    return result;
}

function isValidSpeed(speed) {
    return Number.isInteger(speed) && speed >= 1 && speed <= 10;
}

function isValidAngle(angle) {
    return Number.isInteger(angle) && angle >= -10 && angle <= 10;
}

function isValidDirection(direction) {
    return ["left", "right"].includes(direction);
}

module.exports = { validateCommand };
