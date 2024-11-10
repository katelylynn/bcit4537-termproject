const AuthService = require('./modules/api.js');
require("dotenv").config()

const authService = new AuthService(process.env['JWT_SECRET_KEY']);
authService.start(process.env["PORT"]);
