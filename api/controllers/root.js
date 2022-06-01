const express = require('express');

const userRouter = require('./user/router');
const patientRouter = require('./patient/router');

const root = express.Router({ mergeParams: true });

root.use('/', userRouter);
root.use('/', patientRouter);

module.exports = root;
