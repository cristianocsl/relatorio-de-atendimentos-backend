const { ObjectId } = require('mongodb');
const connection = require('../connection');

module.exports.findPatientById = async (_id) => {
  if (!ObjectId.isValid(_id)) return null;
  const db = await connection();
  const patient = await db.collection('patients').findOne(ObjectId(_id));
  return patient || null;
};
