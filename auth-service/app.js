const AuthService = require('./modules/api.js');

const authService = new AuthService('totallynotakey');
authService.start(3000);
