const http = require('http');

const server = http.createServer((req, res) => {
    // Set CORS headers
    console.log('Request origin:', req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Adjust the port if necessary
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.writeHead(204);
        res.end();
        return;
    }

    /* /login */
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body); // Parse the JSON body
                if (username === 'admin' && password === '111') {
                    res.writeHead(200, {
                        'Set-Cookie': 'token=1234567; HttpOnly;',
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
    /* /something */
    else if (req.url === '/something' && req.method === 'GET') {
        // Check if the user is logged in by checking the cookie
        const cookie = req.headers.cookie;
        if (cookie && cookie.includes('token=123456')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'You are logged in, here is something.' }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized: You are not logged in.' }));
        }
    } else {
        // For any other route, return 404 not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
// Generated mostly by ChatGPT ver. 4
