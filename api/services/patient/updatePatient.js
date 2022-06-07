const ApiError = require('../../error/apiError');
const { INEXISTING_PATIENT, USERID_DOES_NOT_MATCH } = require('../../error/msgCodeError');
const { updatePatient: update, findPatientById } = require('../../models/patient');

module.exports.updatePatient = async (patientId, payload) => {
  const patient = await findPatientById(patientId);
  if (!patient) return ApiError.SendToErrorMiddleware(INEXISTING_PATIENT);
  const { userId, _id } = patient;
  if (userId !== payload.userId) return ApiError.SendToErrorMiddleware(USERID_DOES_NOT_MATCH);
  await update(patientId, payload);
  return { ...payload, userId, _id };
};
