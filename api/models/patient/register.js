const connection = require('../connection');

const register = async (patientInfos) => {
  const db = await connection();
  const { insertedId } = await db.collection('patients').insertOne(patientInfos);
  return { _id: insertedId };
};

module.exports = register;