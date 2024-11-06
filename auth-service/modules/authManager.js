const jwt = require('jsonwebtoken');

module.exports = class AuthManager {
    constructor(secretKey) {
        console.log(secretKey)
        this.SECRET_KEY = secretKey
        this.EXPIRATION = '60s'
    }

    isValidUser(username, password) {
        // make this a db call eventually
        if (username === 'admin' || password === '111') {
            return true
        }
        return false
    }

    handleLogin(req, res) {
        const { username, password } = req.body;

        if (!this.isValidUser(username, password)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log(this.SECRET_KEY)
        const token = jwt.sign({ username }, this.SECRET_KEY, { expiresIn: this.EXPIRATION });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Logged in successfully' });
    }

    handleLogout(req, res) {
        res.cookie('token', '', { httpOnly: true, maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    }

    handleNotFound(req, res) {
        res.status(404).json({ message: '404 Not Found' });
    }

}

