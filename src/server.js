const express = require('express');
const { app } = require('./app');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.json({
    message: 'Aviz Order App is running',
    status: 'healthy',
    routes: app.routes.length
  });
});

server.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP'
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
