const { registerPacient: register } = require('../../models/patient');

module.exports.registerPatient = async (payload) => {
  const {
    unitPrice,
    serviceGoal: { monthly, weekly },
    servicePerformed: { monthly: monthlyDone, weekly: weeklyDone },
   } = payload;
  const prevTotalPrice = unitPrice * monthly;
  const doneTotalPrice = unitPrice * monthlyDone;
  const newPayload = {
    ...payload,
    prevTotalPrice,
    doneTotalPrice,
    servicePending: {
      weekly: weekly - weeklyDone,
      monthly: monthly - monthlyDone,
    },
  };
  await register(newPayload);

  return { ...newPayload, message: 'Paciente cadastrado com sucesso!' };
};