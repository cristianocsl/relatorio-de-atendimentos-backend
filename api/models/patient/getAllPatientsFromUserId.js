const connection = require('../connection');

module.exports.getAllPatientsFromUserId = async (userId) => {
  const db = await connection();
  const patient = await db.collection('patients').find({ userId }).toArray();
  return patient;
};