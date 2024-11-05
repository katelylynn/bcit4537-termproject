const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'totallynotakey';

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username !== 'admin' || password !== '111') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '60s' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in successfully' });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, maxAge: 0 }); // Clear token
    res.status(200).json({ message: 'Logged out successfully' });
});

app.use((req, res) => {
    res.status(404).json({ message: '404 Not Found' });
});

app.listen(3000, () => {
    console.log('Authorization service running on http://localhost:3000');
});
