const express = require('express');
const register = require('./register');
const login = require('./login');

const routerUser = express.Router({ mergeParams: true });

routerUser.post('/register', register); 
routerUser.post('/login', login);

module.exports = routerUser;
