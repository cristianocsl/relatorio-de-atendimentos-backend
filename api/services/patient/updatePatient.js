const ApiError = require('../../error/apiError');
const { INEXISTING_PATIENT } = require('../../error/msgCodeError');
const { updatePatient: update } = require('../../models/patient');
const { findPatientById } = require('../../models/patient');

module.exports.updatePatient = async (patientId, payload) => {
  const patient = await findPatientById(patientId);
  if (!patient) return ApiError.SendToErrorMiddleware(INEXISTING_PATIENT);
  await update(patientId, payload);
  return payload;
};
