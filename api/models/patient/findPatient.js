const connection = require('../connection');

module.exports.findPatient = async (patientData) => {
  const db = await connection();
  const patient = await db.collection('patients').findOne({ ...patientData });
  if (!patient) return null;
  return patient;
};
