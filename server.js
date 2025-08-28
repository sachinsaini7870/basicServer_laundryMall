const http = require('http');
const path = require('path');
const server = require('./api/index.js');

// Set the port for local and production
const PORT = process.env.PORT || 3000;

// Production-ready server configuration
const serverOptions = {
    keepAliveTimeout: 61 * 1000,
    headersTimeout: 65 * 1000
};

// Create server with options
const httpServer = http.createServer(serverOptions, server);

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = httpServer;
