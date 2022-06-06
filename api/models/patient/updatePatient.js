const { ObjectId } = require('mongodb');
const connection = require('../connection');

module.exports.updatePatient = async (_id, patientInfos) => {
  if (!ObjectId.isValid(_id)) return null;
  
  const db = await connection();
  await db.collection('patients').updateOne(
    { _id: ObjectId(_id) },
    { $set: patientInfos },
    );
};