const express = require('express');
const register = require('./register');
const login = require('./login');

const routerRegister = express.Router({ mergeParams: true });

routerRegister.post('/register', register); 
routerRegister.post('/login', login);

module.exports = routerRegister;
