const { findPatient } = require('./findPatient');
const { registerPatient } = require('./registerPatient');
const { updatePatient } = require('./updatePatient');

module.exports = {
  registerPatient,
  findPatient,
  updatePatient,
};
