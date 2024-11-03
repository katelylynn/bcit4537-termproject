
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/something' && req.method === 'GET') {
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
        // Return 404 for any other routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '404 Not Found' }));
    }
});

server.listen(3003, () => {
    console.log('Something service running on http://localhost:3003');
});
