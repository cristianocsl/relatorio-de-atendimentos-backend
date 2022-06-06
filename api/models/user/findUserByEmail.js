const connection = require('../connection');

const findUserByEmail = async (email) => {
  const db = await connection();
  const repetedEmail = await db.collection('users').findOne({ email });
  if (!repetedEmail) return null;
  return repetedEmail;
};

module.exports = findUserByEmail;