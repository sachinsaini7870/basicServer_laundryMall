const http = require('http');
const path = require('path');
const server  = require('./api/index.js');

// Set the port for local development
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
