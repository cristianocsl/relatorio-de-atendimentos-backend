const ApiError = require('../../error/apiError');
const { EXISTING_PATIENT, EMPTY_BODY } = require('../../error/msgCodeError');

const { convertOneDate } = require('../utilities/workingWithDates');

const { registerPatient: register, findPatient } = require('../../models/patient');
const { registerFinances } = require('../../models/finances');

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

  const status = payload.status || 'OK';
  const activeService = payload.activeService || 'Sim';
  const createdAt = new Date().toISOString();
  const myNewPayload = {
    ...payload,
    status,
    activeService,
    createdAt,
    prevTotalPrice,
    doneTotalPrice,
    servicePending: {
      weekly: weekly - weeklyDone,
      monthly: monthly - monthlyDone,
    },
  };
  
  const { _id: patientId } = await register(myNewPayload);
  
  await registerFinances({
    patientId,
    ...payload.useId,
    prevTotalPrice,
    doneTotalPrice,
    ...payload.healthInsurance,
    createdAt,
  });

  return {
    ...myNewPayload,
    createdAt: convertOneDate(createdAt),
    message: 'Paciente cadastrado com sucesso!',
  };
};