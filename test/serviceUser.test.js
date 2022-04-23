const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const RegisterModel = require('../api/models/user');
const RegisterService = require('../api/services/user');

describe('Testes de verificação da camada service para registro e login:', function () {
  let connectionMock;
  const payload = {
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
    securityPhrase: 'meu-segredo',
  };

  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);

    sinon.stub(RegisterModel, 'register').resolves({ ...payload });
  });

  afterAll(function () {
    RegisterModel.register.restore();
  });

  describe('- ao realizar o cadastro', function () {
    test('verifica o funcionamento do método register', async function () {
      const response = await RegisterService.register({ ...payload });

      expect(response).toHaveProperty('name');
      expect(response.name).toEqual('Cristiano');
      expect(response.token).toEqual('abc');
    });
  });
});