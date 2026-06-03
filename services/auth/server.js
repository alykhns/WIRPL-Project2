// services/auth-service/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth'));

app.get('/health', (req, res) => res.json({ service: 'auth', status: 'ok' }));

app.listen(3001, () => console.log('Auth service running on port 3001'));