const express = require('express');
const { registerPatient } = require('.');
const { authentication } = require('../../middlewares/auth');

const patientRouter = express.Router({ mergeParams: true });

patientRouter.post('/registerPatient', authentication, registerPatient); 

module.exports = patientRouter;
