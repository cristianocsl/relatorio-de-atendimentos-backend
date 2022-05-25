const express = require('express');
const register = require('./register');
const login = require('./login');

const userRouter = express.Router({ mergeParams: true });

userRouter.post('/register', register); 
userRouter.post('/login', login);

module.exports = userRouter;
