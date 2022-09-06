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
    healthInsurance,
    userId,
    schedule,
   } = payload;

  const prevTotalPrice = +(unitPrice * monthly).toFixed(2);
  const doneTotalPrice = +(unitPrice * monthlyDone).toFixed(2);

  const activeService = payload.activeService || 'Sim';
  const createdAt = new Date().toISOString();
  const myNewPayload = {
    ...payload,
    schedule,
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
    userId,
    prevTotalPrice,
    doneTotalPrice,
    healthInsurance,
    createdAt,
  });

  return {
    ...myNewPayload,
    createdAt: convertOneDate(createdAt),
    message: 'Paciente cadastrado com sucesso!',
  };
};