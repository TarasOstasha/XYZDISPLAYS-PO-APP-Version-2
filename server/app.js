const express = require('express');
const router = require('./routes');
const cors = require('cors');
const app = express();
const path = require('path');

const corsOPtions = {
    origin: '*'
}

app.use(cors(corsOPtions));

app.use(express.json());

app.use('/api', router);

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// For all other requests, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app;