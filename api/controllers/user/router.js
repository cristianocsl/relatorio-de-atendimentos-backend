const express = require('express');
const register = require('./register');

const routerRegister = express.Router({ mergeParams: true });

routerRegister.post('/register', register); 

module.exports = routerRegister;
