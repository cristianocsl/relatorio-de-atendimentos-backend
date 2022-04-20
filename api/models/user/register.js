const { client } = require('../connection');

const register = async (userInfos) => {
  const db = client.db('homeCareDB');
  console.log('teste >>');
  const { insertedId } = await db.collection('users').insertOne(userInfos);
  return { id: insertedId };
};

module.exports = register;