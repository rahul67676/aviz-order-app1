const express = require('express');
const path = require('path');
const { app } = require('./app');

const server = express();

server.use(express.json());

// Serve frontend files
server.use(express.static(path.join(__dirname, '../public')));

// Home page
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check
server.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP'
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
