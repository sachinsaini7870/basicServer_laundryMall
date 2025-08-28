const http = require('http');
const fs = require('fs');
const path = require('path');

// Serve HTML pages only
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // 404 fallback
            fs.readFile(path.join(__dirname, '../public/404.html'), (err404, content404) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(content404);
            });
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// Vercel Serverless Function Handler
module.exports = (req, res) => {
    const url = req.url;
    let filePath = '';

    // Page Routes
    const routes = {
        '/': '/index.html',
        '/home': '/index.html',
        '/about': '/about.html',
        '/contact': '/contact.html',
        '/services': '/services.html'
    };

    const routePath = routes[url];
    if (routePath) {
        filePath = path.join(__dirname, '../public', routePath);
        return serveStaticFile(res, filePath, 'text/html');
    }

    // 404 fallback
    filePath = path.join(__dirname, '../public/404.html');
    serveStaticFile(res, filePath, 'text/html');
};
