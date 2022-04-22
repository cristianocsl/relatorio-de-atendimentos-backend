const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { register } = require('../api/models/user');

describe('Testes para registro e login:,', function () {
  let connectionMock;
  
  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = await MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  afterAll(function () {
    MongoClient.connect.restore();
  });

  const payload = {
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
    confirmPassword: '123456',
    securityPhrase: 'meu-segredo',
  };
  
  describe('- ao realizar o cadastro', function () {
    test('garante que um documento é inserido no banco de dados:', async function () {
      await register({ ...payload });
      const db = await connectionMock.db('HomeCareDB');
      const coll = await db.collection('users');
      const result = await coll.findOne({ name: 'Cristiano' });
      expect(result).not.toBe(null);
    });
    test('garante que existe uma propriedade \'_id\'', async function () {
      const response = await register({ ...payload });
      const { _id: idValue } = response;
      expect(response).toHaveProperty('_id', idValue);
    });
  });
});
