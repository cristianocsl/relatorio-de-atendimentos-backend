const ApiError = require('../../error/apiError');
const { EXISTING_PATIENT } = require('../../error/msgCodeError');

const { registerPatient: register } = require('../../models/patient');
const { findPatient } = require('../../models/patient');

const newPayload = ({ 
    payload, weekly, weeklyDone, monthly, monthlyDone, prevTotalPrice, doneTotalPrice,
  }) => ({
  ...payload,
    prevTotalPrice,
    doneTotalPrice,
    servicePending: {
      weekly: weekly - weeklyDone,
      monthly: monthly - monthlyDone,
    },
  });

module.exports.registerPatient = async (payload) => {
  const patient = await findPatient({ patient: payload.patient, userId: payload.userId });

  if (patient) return ApiError.SendToErrorMiddleware(EXISTING_PATIENT);

  const {
    unitPrice,
    serviceGoal: { monthly, weekly },
    servicePerformed: { monthly: monthlyDone, weekly: weeklyDone },
   } = payload;

  const prevTotalPrice = unitPrice * monthly;
  const doneTotalPrice = unitPrice * monthlyDone;

  const myNewPayload = newPayload({
    payload, weekly, weeklyDone, monthly, monthlyDone, prevTotalPrice, doneTotalPrice,
  });

  await register(myNewPayload);

  return { ...myNewPayload, message: 'Paciente cadastrado com sucesso!' };
};