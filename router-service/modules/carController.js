const https = require('https');
const { URL } = require('url');
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

                // Collect data from the response
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
                                error: `Car service returned status ${res.statusCode}: ${parsedData.error || 'Unknown error'}`,
                            });
                        }
                    } catch (err) {
                        reject({
                            success: false,
                            error: `Failed to parse response from car service: ${err.message}`,
                        });
                    }
                });
            });

            req.on('error', (err) => {
                reject({ success: false, error: `Request error: ${err.message}` });
            });

            // Write the request body and end the request
            req.write(JSON.stringify(params));
            req.end();
        });
    }
};
