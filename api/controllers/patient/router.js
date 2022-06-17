const express = require('express');
const { registerPatient, updatePatient, getAllPatientsFromUserId } = require('.');
const { authentication } = require('../../middlewares/auth');

const patientRouter = express.Router({ mergeParams: true });

patientRouter.get('/patients', authentication, getAllPatientsFromUserId);
patientRouter.post('/registerPatient', authentication, registerPatient);
patientRouter.put('/patient/:patientId', authentication, updatePatient);

module.exports = patientRouter;
