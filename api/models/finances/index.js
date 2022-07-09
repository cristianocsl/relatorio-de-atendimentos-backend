const connection = require('../connection');

module.exports.registerFinances = async (payload) => {
  const db = await connection();
  const { insertedId } = await db.collection('finances').insertOne(payload);
  return { _id: insertedId };
};
