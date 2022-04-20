const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const getConnection = async () => {
  const DBSERVER = await MongoMemoryServer.create();
  const URLMock = DBSERVER.getUri();
  const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'homeCareDB',
  };

  return MongoClient.connect(URLMock, OPTIONS);
};

module.exports = { getConnection };