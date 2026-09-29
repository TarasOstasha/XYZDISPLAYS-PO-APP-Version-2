require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5000;
//const HOST = process.env.HOST || 'localhost' // '127.0.0.1';
const HOST = process.env.HOST || '0.0.0.0';

const httpServer = http.createServer(app);

// Handle port already in use error
httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Server may already be running.`);
    // Don't exit, just log the message
  } else {
    console.error('Server error:', err);
  }
});

httpServer.listen(PORT, HOST, () =>
  console.log(`Server is listening on http://${HOST}:${PORT}`)
);


// httpServer.listen(PORT, () =>
//   console.log(`Server is listening on port ${PORT}`)
// );
