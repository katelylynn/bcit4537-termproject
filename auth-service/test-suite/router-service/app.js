const http = require('http');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'totallynotakey';

const forwardRequest = (req, res, targetPort) => {
    const options = {
        hostname: 'localhost',
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    });
};

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': 'http://localhost:3001',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        });
        res.end();
        return;
    }

    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

    // Route `/login` and `/logout` to the authorization service on port 3000
    if (req.url === '/login' || req.url === '/logout') {
        forwardRequest(req, res, 3000);
    }
    // Route `/something` to the resource service on port 3003
    else if (req.url === '/something') {
        const token = req.headers.cookie?.replace('token=', '');

        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized: No token provided' }));
            return;
        }

        try {
            jwt.verify(token, SECRET_KEY);  // Verify JWT
            forwardRequest(req, res, 3003); // Forward to Resource-Service if valid
        } catch (err) {
            console.log(err)
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized Invalid token' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '404 Not Found' }));
    }
});

server.listen(3002, () => {
    console.log('Router service running on http://localhost:3002');
});
