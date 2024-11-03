const http = require('http');

// Helper function to forward the request to the target server
const forwardRequest = (req, res, targetPort) => {
    const options = {
        hostname: 'localhost',
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        // Set CORS headers for the client
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

        // Pipe the response from the target server back to the client
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    // Pipe the request data from the client to the target server
    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    });
};

// Main router service logic
const server = http.createServer((req, res) => {
    // Handle CORS preflight requests
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

    // Route `/login` to the main API server on port 3000
    if (req.url === '/login') {
        forwardRequest(req, res, 3000);
    }
    // Route `/something` to the "something" service on port 3003
    else if (req.url === '/something') {
        forwardRequest(req, res, 3003);
    } else {
        // Return 404 for any other routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '404 Not Found' }));
    }
});

server.listen(3002, () => {
    console.log('Router service running on http://localhost:3002');
});
