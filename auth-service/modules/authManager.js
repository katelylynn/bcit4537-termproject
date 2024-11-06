const jwt = require('jsonwebtoken');

module.exports = class AuthManager {
    constructor(secretKey) {
        console.log(secretKey)
        this.SECRET_KEY = secretKey
        this.EXPIRATION = '60s'
    }

    isValidUser(email, password) {
        // make this a db call eventually
        if (email === 'admin' || password === '111') {
            return true
        }
        return false
    }

    handleLogin(req, res) {
        const { email, password } = req.body;

        if (!this.isValidUser(email, password)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log(this.SECRET_KEY)
        const token = jwt.sign({ email }, this.SECRET_KEY, { expiresIn: this.EXPIRATION });
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

