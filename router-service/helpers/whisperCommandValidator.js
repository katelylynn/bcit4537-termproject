const { VALID_COMMANDS, ERROR_MESSAGES } = require('../lang/en');
const { convertWordsToNumbers } = require('../helpers/convertWordsToNumbers');
const { processNegativeValues } = require('../helpers/processNegativeValues');

function validateCommand(transcription) {
    const sanitizedTranscription = transcription.toLowerCase().trim().replace(/[.,!?]/g, "");
    console.log("validateCommand - Sanitized transcription:", sanitizedTranscription);

    const [command, ...args] = sanitizedTranscription.split(" ");
    console.log("validateCommand - Command:", command, "Args:", args);

    if (!VALID_COMMANDS[command]) {
        return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
    }

    const processedArgs = convertWordsToNumbers(args);
    console.log("convertWordsToNumbers - Processed args:", processedArgs);

    const convertedArgs = processNegativeValues(processedArgs);
    console.log("processNegativeValues - Converted args:", convertedArgs);


    const result = { isValid: true, command: VALID_COMMANDS[command], params: {} };

    switch (command) {
        case "forward":     
        case "backward":
            console.log("FORWARD OR BACKWARD")
            if (convertedArgs.length === 0) {
                result.params = { speed: 1, angle: 0 };
            } 
            else if (convertedArgs.length === 1) {
                const speed = Number(convertedArgs[0]);
                if (!isValidSpeed(speed)) {
                    console.error("validateCommand - Invalid speed:", speed);
                    return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
                }
                result.params = { speed, angle: 0 };
            } 
            else if (convertedArgs.length === 2) {
                const [speed, angle] = convertedArgs.map(Number);
                if (!isValidSpeed(speed) || !isValidAngle(angle)) {
                    return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
                }
                result.params = { speed, angle };
            } 
            else {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            break;

        case "rotate":
            if (convertedArgs.length !== 2) {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            const [rotateSpeed, direction] = [Number(convertedArgs[0]), convertedArgs[1]];
            if (!isValidSpeed(rotateSpeed) || !isValidDirection(direction)) {
                return { isValid: false, error: ERROR_MESSAGES.invalidCommand };
            }
            result.params = { speed: rotateSpeed, direction };
            break;

        case "stop":
            if (convertedArgs.length !== 0) {
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
