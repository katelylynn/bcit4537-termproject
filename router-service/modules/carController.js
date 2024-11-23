const https = require('https');
const { URL } = require('url');
const { ERROR_MESSAGES } = require('../lang/en');
require('dotenv').config();

const CAR_SERVICE_URL = process.env.CAR_SERVICE;

module.exports = class CarController {
    /**
     * Sends a command to the car service.
     * @param {string} command - The command to send (e.g., /forward, /rotate).
     * @param {Object} params - The parameters for the command (e.g., speed, angle, direction).
     * @returns {Object} - The result of the car service interaction.
     */
    static async sendCarCommand(command, params) {
        return new Promise((resolve, reject) => {
            const endpoint = `${CAR_SERVICE_URL}${command}`;
            const url = new URL(endpoint);

            const options = {
                hostname: url.hostname,
                port: 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(params)),
                },
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);

                        if (res.statusCode === 200) {
                            resolve({ success: true, data: parsedData });
                        } else {
                            reject({
                                success: false,
                                error: ERROR_MESSAGES.carServiceError
                                    .replace('{statusCode}', res.statusCode)
                                    .replace('{error}', parsedData.error || ERROR_MESSAGES.carServiceUnknownError),
                            });
                        }
                    } catch (err) {
                        reject({
                            success: false,
                             error: ERROR_MESSAGES.carServiceParseError.replace('{error}', err.message),
                        });
                    }
                });
            });

            req.on('error', (err) => {
                reject({ success: false, error: ERROR_MESSAGES.carServiceRequestError.replace('{error}', err.message) });
            });

            req.write(JSON.stringify(params));
            req.end();
        });
    }

    static justin1(req, res) {

    }

    static justin2(req, res) {

    }

}
