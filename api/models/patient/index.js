const { findPatient } = require('./findPatient');
const { registerPatient } = require('./registerPatient');
const { updatePatient } = require('./updatePatient');
const { findPatientById } = require('./findPatientById');
const { getAllPatientsFromUserId } = require('./getAllPatientsFromUserId');

module.exports = {
  registerPatient,
  findPatient,
  updatePatient,
  findPatientById,
  getAllPatientsFromUserId,
};
