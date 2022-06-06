const connection = require('../connection');

module.exports.registerPatient = async (patientInfos) => {
  const db = await connection();
  const { insertedId } = await db.collection('patients').insertOne(patientInfos);
  return { _id: insertedId };
};
