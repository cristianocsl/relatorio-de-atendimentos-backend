const ApiError = require('../../error/apiError');
const { INEXISTING_PATIENT, USERID_DOES_NOT_MATCH } = require('../../error/msgCodeError');
const { updatePatient: update, findPatientById } = require('../../models/patient');
const { registerFinances } = require('../../models/finances');
const { convertOneDate } = require('../utilities/workingWithDates');

module.exports.updatePatient = async (patientId, payload) => {
  const patient = await findPatientById(patientId);

  if (!patient) throw new ApiError(INEXISTING_PATIENT);
  const { userId, _id } = patient;

  if (userId !== payload.userId) throw new ApiError(USERID_DOES_NOT_MATCH);

  const updatedAt = new Date().toISOString();

  const {
    unitPrice,
    serviceGoal: { monthly, weekly },
    servicePerformed: { monthly: monthlyDone, weekly: weeklyDone },
    prevTotalPrice: prevTotalPriceToNumber,
   } = payload;

  const doneTotalPrice = +(unitPrice * monthlyDone).toFixed(2);
  const prevTotalPrice = +prevTotalPriceToNumber.toFixed(2);

  const myNewPayload = {
    ...payload,
    prevTotalPrice,
    doneTotalPrice,
    servicePending: {
      weekly: weekly - weeklyDone,
      monthly: monthly - monthlyDone,
    },
  };

  await registerFinances({
    patientId,
    patient: patient.patient,
    userId,
    prevTotalPrice,
    doneTotalPrice,
    healthInsurance: payload.healthInsurance,
    createdAt: updatedAt,
  });

  await update(patientId, { ...myNewPayload, updatedAt });

  return { ...myNewPayload, userId, _id, updatedAt: convertOneDate(updatedAt) };
};
