const { findPatient } = require('./findPatient');
const { registerPatient } = require('./registerPatient');
const { updatePatient } = require('./updatePatient');
const { findPatientById } = require('./findPatientById');

module.exports = {
  registerPatient,
  findPatient,
  updatePatient,
  findPatientById,
};
