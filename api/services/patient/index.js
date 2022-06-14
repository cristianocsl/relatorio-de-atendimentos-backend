const { registerPatient } = require('./registerPatient');
const { updatePatient } = require('./updatePatient');
const { getAllPatientsFromUserId } = require('./getAllPatientsFromUserId');

module.exports = {
  registerPatient,
  updatePatient,
  getAllPatientsFromUserId,
};
