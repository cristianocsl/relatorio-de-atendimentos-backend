const ApiError = require('../../error/apiError');
const { INEXISTING_PATIENT, USERID_DOES_NOT_MATCH } = require('../../error/msgCodeError');
const { updatePatient: update, findPatientById } = require('../../models/patient');
const { convertOneDate } = require('../utilities/workingWithDates');

module.exports.updatePatient = async (patientId, payload) => {
  const patient = await findPatientById(patientId);

  if (!patient) throw new ApiError(INEXISTING_PATIENT);
  const { userId, _id } = patient;

  if (userId !== payload.userId) throw new ApiError(USERID_DOES_NOT_MATCH);
  const updatedAt = new Date().toISOString();

  await update(patientId, { ...payload, updatedAt });

  return { ...payload, userId, _id, updatedAt: convertOneDate(updatedAt) };
};
