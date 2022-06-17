const ApiError = require('../../error/apiError');
const { EXISTING_PATIENT, EMPTY_BODY } = require('../../error/msgCodeError');

const { convertOneDate } = require('../utilities/outputDate');

const { registerPatient: register } = require('../../models/patient');
const { findPatient } = require('../../models/patient');

module.exports.registerPatient = async (payload) => {
  if (!payload.patient) throw new ApiError(EMPTY_BODY);
  
  const patient = await findPatient({ patient: payload.patient, userId: payload.userId });

  if (patient) throw new ApiError(EXISTING_PATIENT);

  const {
    unitPrice,
    serviceGoal: { monthly, weekly },
    servicePerformed: { monthly: monthlyDone, weekly: weeklyDone },
   } = payload;

  const prevTotalPrice = unitPrice * monthly;
  const doneTotalPrice = unitPrice * monthlyDone;

  const status = payload.status || 'Ativo';
  const priority = payload.priority || 'Normal';
  const createdAt = new Date().toISOString();
  const myNewPayload = {
    ...payload,
    status,
    priority,
    createdAt,
    prevTotalPrice,
    doneTotalPrice,
    servicePending: {
      weekly: weekly - weeklyDone,
      monthly: monthly - monthlyDone,
    },
  };

  await register(myNewPayload);

  return {
    ...myNewPayload,
    createdAt: convertOneDate(createdAt),
    message: 'Paciente cadastrado com sucesso!',
  };
};