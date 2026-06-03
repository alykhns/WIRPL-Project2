// gateway/server.js
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

const services = {
  '/api/auth':      'http://localhost:3001',
  '/api/users':     'http://localhost:3001',
  '/api/products':  'http://localhost:3002',
  '/api/orders':    'http://localhost:3003',
  '/api/payment':   'http://localhost:3004',
  '/api/logistics': 'http://localhost:3005',
  '/api/supplier':  'http://localhost:3006',
};

Object.entries(services).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({ target, changeOrigin: true }));
});

app.get('/health', (req, res) => res.json({ status: 'Gateway running' }));

app.listen(3000, () => console.log('Gateway running on port 3000'));