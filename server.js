const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const root = require('./api/controllers/root');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/', root);

module.exports = app;