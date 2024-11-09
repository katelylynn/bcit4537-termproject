const AuthService = require('./modules/api.js');
require("dotenv").config()

const authService = new AuthService('totallynotakey');
authService.start(process.env["PORT"]);
