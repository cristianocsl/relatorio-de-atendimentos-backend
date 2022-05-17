const express = require('express');

const routerRegister = require('./user/router');

const root = express.Router({ mergeParams: true });

root.use('/', routerRegister);

module.exports = root;
