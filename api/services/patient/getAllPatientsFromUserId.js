const { getAllPatientsFromUserId: getAll } = require('../../models/patient');
const ApiError = require('../../error/apiError');
const { EMPTY_PATIENT_LIST } = require('../../error/msgCodeError');

module.exports.getAllPatientsFromUserId = async (userId) => {
  const patients = await getAll(userId);
  if (!patients.length) return new ApiError(EMPTY_PATIENT_LIST);

  return patients;
};
