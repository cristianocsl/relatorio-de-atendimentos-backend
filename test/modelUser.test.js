const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { register, findUserByEmail } = require('../api/models/user');

describe('Testes de verificação da camada model para registro e login:,', function () {
  let connectionMock;
  
  const payload = {
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
    confirmPassword: '123456',
    securityPhrase: 'meu-segredo',
  };
  
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

  beforeEach(async function () {
    await register({ ...payload });
  });
  
  describe('- ao realizar o cadastro', function () {
    test('garante que um documento é inserido no banco de dados:', async function () {
      const db = await connectionMock.db('HomeCareDB');
      const coll = await db.collection('users');
      const result = await coll.findOne({ name: 'Cristiano' });

      expect(result).not.toBe(null);
    });

    test('garante que o método register possui uma propriedade \'_id\'', async function () {
      const response = await register({ ...payload });
      const { _id: idValue } = response;

      expect(response).toHaveProperty('_id', idValue);
    });
  });

  describe('- ao realizar o login, o método findUserByEmail', function () {
    test('retorna os dados do usuário, se ele existir no banco de dados', async function () {
      const response = await findUserByEmail('cslcristiano@gmail.com');

      expect(response.email).toStrictEqual(payload.email);
      expect(response.name).toStrictEqual(payload.name);
    });
    test('retorna null, caso o usuário não seja encontrado no banco de dados', async function () {
      const response = await findUserByEmail('email_nao_existente@gmail.com');
      expect(response).toBe(null);
    });
  });
});
