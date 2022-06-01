const { registerPatient: register } = require('../../models/patient');
const { findPatient } = require('../../models/patient/findPatient');

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
  const patient = await findPatient({ patient: payload.patient });
  console.log('patient', patient);
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