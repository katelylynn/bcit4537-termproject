const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const UserCredentialsManager = require('./userCredentialsManager');

const SALT_ROUNDS = 10

module.exports = class AuthManager {

    constructor(secretKey) {
        console.log(secretKey)
        this.SECRET_KEY = secretKey
        this.EXPIRATION = '1h'
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
        
        console.log(`reached after uid and user fetch with uid ${uid}, and user ${user}`)

        if (!uid || !user) {
            return res.status(401).json({ message: userMessages.userNotFound });
        }

        const correctPassword = bcrypt.compareSync(password, user.password)

        if (!correctPassword) {
            return res.status(401).json({ message: userMessages.invalidPassword });
        }

        console.log(`reached after password confirmation`)

        const token = jwt.sign({ user }, this.SECRET_KEY, { expiresIn: this.EXPIRATION });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None'});
        res.status(200).json({ message: userMessages.loginSuccess, 'role': user.role });
    }

    handleLogout(req, res) {
        res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 0});
        res.status(200).json({ message: userMessages.logoutSuccess  });
    }

    handleNotFound(req, res) {
        res.status(404).json({ message: userMessages.notFound });
    }

}

