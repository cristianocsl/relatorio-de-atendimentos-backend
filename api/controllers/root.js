const express = require('express');

const userRouter = require('./user/router');
const patientRouter = require('./patient/router');
const routerWakeup = require('./wakeup_api/router');

const root = express.Router({ mergeParams: true });

root.use('/wakeup', routerWakeup);
root.use('/', userRouter);
root.use('/', patientRouter);

module.exports = root;
