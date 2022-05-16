const express = require('express');
const register = require('./register');

const routerRegister = express.Router({ mergeParams: true });

routerRegister.post('/', register); 

module.exports = routerRegister;
