const http = require('http');
const fs = require('fs');
const path = require('path');


// Helper function to serve static files
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Handle file not found
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, '../public/404.html'), (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404);
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Successful file read
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".txt": "text/plain",
    // Add more as needed
};

// Create the server
const server = http.createServer((req, res) => {
    // Log incoming requests
    log(`${req.method} request to ${req.url}`);

    // Normalize the URL path
    const url = req.url;
    let filePath = '';

    // Serve assets
    if (url.startsWith('/assets/')) {
        filePath = path.join(__dirname, '../public', url);
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        serveStaticFile(res, filePath, contentType);
        return;
    }

    // Routing logic
    switch (url) {
        case '/':
        case '/home':
            filePath = path.join(__dirname, '../public/index.html');
            serveStaticFile(res, filePath, 'text/html');
            break;

        case '/services':
            filePath = path.join(__dirname, '../public/services.html');
            serveStaticFile(res, filePath, 'text/html');
            break;

        case '/about':
            filePath = path.join(__dirname, '../public/about.html');
            serveStaticFile(res, filePath, 'text/html');
            break;

        case '/contact':
            filePath = path.join(__dirname, '../public/contact.html');
            serveStaticFile(res, filePath, 'text/html');
            break;

        // Serve CSS files
        case '/css/styles.css':
            filePath = path.join(__dirname, '../public/css/styles.css');
            serveStaticFile(res, filePath, 'text/css');
            break;

        // Serve JavaScript files
        case '/js/script.js':
            filePath = path.join(__dirname, '../public/js/script.js');
            serveStaticFile(res, filePath, 'application/javascript');
            break;

        default:
            // Handle 404 for any other routes
            fs.readFile(path.join(__dirname, '../public/404.html'), (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading 404 page');
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content);
                }
            });
    }

    // Add error logging
    res.on('error', (err) => {
        log(`Response error: ${err.message}`);
    });
});

// Export the server for Vercel
module.exports = server;
