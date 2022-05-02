const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const RegisterModel = require('../api/models/user');
const RegisterService = require('../api/services/user');
const ApiError = require('../api/error/apiError');
const { USER_DOES_NOT_EXIST, INCORRECT_LOGIN } = require('../api/error/msgCodeError');

describe('Testes de verificação da camada service para registro e login:', function () {
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
    sinon.stub(ApiError, 'SendToErrorMiddleware')
      .onCall(0)
        .resolves(USER_DOES_NOT_EXIST)
      .onCall(1)
        .resolves(INCORRECT_LOGIN);
    
    await RegisterModel.register({
      name: 'Cristiano',
      email: 'cslcristiano@gmail.com',
      password: '123456',
      securityPhrase: 'meu-segredo',
    });
  });

  afterAll(async function () {
    MongoClient.connect.restore();
    ApiError.SendToErrorMiddleware.restore();
  });

  describe('- ao realizar o login com um email que não existe no banco de dados', function () {
    test('retorna um código e uma mensagem de erro', async function () {
      const response = await RegisterService.login({
        email: 'email_diferente@gmail.com',
        password: '123456',
      });
      
      expect(response).toHaveProperty('code');
      expect(response).toHaveProperty('message');
      expect(response.code).toEqual(USER_DOES_NOT_EXIST.code);
      expect(response.message).toEqual(USER_DOES_NOT_EXIST.message);
    });
  });
  
  describe('- ao realizar o login com uma senha errada', function () {
    test('retorna um código e uma mensagem de erro', async function () {
      const response = await RegisterService.login({
        email: 'cslcristiano@gmail.com',
        password: 'xxxxxx',
      });
      
      expect(response).toHaveProperty('code');
      expect(response).toHaveProperty('message');
      expect(response.code).toEqual(INCORRECT_LOGIN.code);
      expect(response.message).toEqual(INCORRECT_LOGIN.message);
    });
  });
});