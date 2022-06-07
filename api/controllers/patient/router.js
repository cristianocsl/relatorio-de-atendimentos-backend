const express = require('express');
const { registerPatient, updatePatient } = require('.');
const { authentication } = require('../../middlewares/auth');

const patientRouter = express.Router({ mergeParams: true });

patientRouter.post('/registerPatient', authentication, registerPatient);
patientRouter.put('/patient/:patientId', authentication, updatePatient);

module.exports = patientRouter;
