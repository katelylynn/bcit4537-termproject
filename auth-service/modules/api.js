const express = require('express');
const AuthManager = require('./authManager.js');

module.exports = class AuthService {
    
    constructor(secretKey) {
        console.log(secretKey)
        this.am = new AuthManager(secretKey)
        this.app = express();
        this.app.use(express.json());
        this.exposeRoutes();
    }
    
    start(port) {
        this.app.listen(port, () => {
            console.log(`Authorization service running on http://localhost:${port}`);
        });
    }
    
    exposeRoutes() {
        this.app.post('/login', this.am.handleLogin.bind(this.am));
        this.app.post('/logout', this.am.handleLogout.bind(this.am));
        this.app.use(this.am.handleNotFound.bind(this.am));
    }

}
