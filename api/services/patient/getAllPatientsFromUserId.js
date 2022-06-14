const { getAllPatientsFromUserId: getAll } = require('../../models/patient');

module.exports.getAllPatientsFromUserId = async (userId) => {
  const patients = await getAll(userId);
  return patients;
};
