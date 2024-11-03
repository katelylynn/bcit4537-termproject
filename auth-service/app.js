const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                if (username === 'admin' && password === '111') {
                    res.writeHead(200, {
                        'Set-Cookie': 'token=123456; HttpOnly;',
                        'Content-Type': 'application/json',
                    });
                    res.end(JSON.stringify({ message: 'Logged in successfully' }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Unauthorized' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });
    }
    // Logout endpoint to clear the token cookie
    else if (req.url === '/logout' && req.method === 'POST') {
        res.writeHead(200, {
            'Set-Cookie': 'token=; HttpOnly; Max-Age=0', // Clear the token by setting an expired cookie
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: 'Logged out successfully' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '404 Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Authorization service running on http://localhost:3000');
});
