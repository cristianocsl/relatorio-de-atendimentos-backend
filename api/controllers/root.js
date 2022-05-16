const express = require('express');

const routerRegister = require('./user/router');

const root = express.Router({ mergeParams: true });

root.use('/register', routerRegister);

module.exports = root;
