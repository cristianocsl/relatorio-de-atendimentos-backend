const connection = require('../connection');

module.exports.getFinances = async (userId) => {
  const db = await connection();
  const finances = await db.collection('finances').find({ userId }).toArray();
  return finances;
};