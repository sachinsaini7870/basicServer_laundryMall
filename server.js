// Planning:
// - Serve static files from /public directory
// - Map clean URLs (/, /about, /services, /contact) to HTML files
// - Handle 404 and server errors gracefully
// - Set correct MIME types for responses
// - Listen on configurable port

// Working:
// - Uses Node.js http, fs, path, url modules
// - MIME_TYPES object maps file extensions to content types
// - routes object maps clean URLs to HTML files
// - Checks if requested path is a directory, serves index.html if so
// - Reads requested file and sends response
// - Handles file not found (404) and server errors (500)
// - Starts server and logs running URL

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Route mapping for clean URLs
const routes = {
  '/': 'index.html',
  '/about': 'about.html',
  '/services': 'services.html',
  '/contact': 'contact.html'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle root route
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // Check if this is a route we've mapped
  if (routes[pathname]) {
    pathname = '/' + routes[pathname];
  }
  
  // Get the file extension
  const extname = path.extname(pathname).toLowerCase();
  
  // Set the content type based on file extension
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Build the full file path
  let filePath = path.join(PUBLIC_DIR, pathname);
  
  // If the path is a directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Read and serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
      } else {
        // Server error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Internal Server Error: ' + err.code);
      }
    } else {
      // Successful response
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});