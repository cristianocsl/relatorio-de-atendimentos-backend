const connection = require('../connection');

const register = async (userInfos) => {
  const db = await connection();
  const { insertedId } = await db.collection('users').insertOne(userInfos);
  return { _id: insertedId };
};

module.exports = register;