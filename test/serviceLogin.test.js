const bcrypt = require('bcrypt');

const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const RegisterModel = require('../api/models/user');
const RegisterService = require('../api/services/user');

describe('Testes de verificação da camada service para login:', function () {
  let connectionMock;

  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').returns(connectionMock);
    sinon.stub(bcrypt, 'compare').returns(true);
    
    await RegisterModel.register({
      name: 'Cristiano',
      email: 'cslcristiano@gmail.com',
      password: '123456',
      securityPhrase: 'meu-segredo',
    });
  });

  afterAll(async function () {
    MongoClient.connect.restore();
    bcrypt.compare.restore();
  });

  describe('- ao realizar o login com sucesso, verifica que o método login', function () {
    test('retorna as chaves "name" e "token"', async function () {
      const response = await RegisterService.login({
        email: 'cslcristiano@gmail.com',
        password: '123456',
      });
      
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('token');
    });
  });
});