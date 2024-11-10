const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const UserCredentialsManager = require('./userCredentialsManager');

const SALT_ROUNDS = 10

module.exports = class AuthManager {

    constructor(secretKey) {
        console.log(secretKey)
        this.SECRET_KEY = secretKey
        this.EXPIRATION = '60s'
    }

    handleRegister(req, res) {
        const { password } = req.body

        delete req.body['password']

        const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS)

        req.body['hashedPassword'] = hashedPassword

        UserCredentialsManager.registerUser(req, res, hashedPassword)
    }

    async handleLogin(req, res) {
        const { email, password } = req.body;

        const uid = await UserCredentialsManager.getUid(email)
        const user = await UserCredentialsManager.getUser(uid)
        const correctPassword = bcrypt.compareSync(password, user.password)

        if (!correctPassword) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = jwt.sign({ user }, this.SECRET_KEY, { expiresIn: this.EXPIRATION });
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

