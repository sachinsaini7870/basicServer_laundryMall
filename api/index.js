const http = require('http');
const fs = require('fs');
const path = require('path');

// Improved Static File Serving
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Enhanced error handling
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, '../public/404.html'), (err404, content404) => {
                    res.writeHead(404, {
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    });
                    res.end(content404);
                });
            } else {
                // Server error
                res.writeHead(500, {
                    'Content-Type': 'text/plain',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Successful file read with caching
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400' // 1 day caching
            });
            res.end(content);
        }
    });
}

// Vercel Serverless Function Handler
module.exports = (req, res) => {
    const url = req.url;
    let filePath = '';

    // Comprehensive Route Handling
    try {
        // Static Assets Handling
        if (url.startsWith('/assets/') || url.startsWith('/css/') || url.startsWith('/js/')) {
            const normalizedPath = url.replace(/^\/+/, '');
            filePath = path.join(__dirname, '../public', normalizedPath);

            const ext = path.extname(filePath).toLowerCase();
            const contentType = getMimeType(ext);

            return serveStaticFile(res, filePath, contentType);
        }

        // Page Routes
        const routes = {
            '/': '/index.html',
            '/home': '/index.html',
            '/about': '/about.html',
            '/contact': '/contact.html',
            '/services': '/services.html'
        };

        // Resolve file path based on routes
        const routePath = routes[url];
        if (routePath) {
            filePath = path.join(__dirname, '../public', routePath);
            return serveStaticFile(res, filePath, 'text/html');
        }

        // 404 Handling
        filePath = path.join(__dirname, '../public/404.html');
        serveStaticFile(res, filePath, 'text/html');

    } catch (error) {
        console.error('Server Error:', error);
        res.writeHead(500, {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('Internal Server Error');
    }
};

// MIME Type Helper Function
function getMimeType(ext) {
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}
