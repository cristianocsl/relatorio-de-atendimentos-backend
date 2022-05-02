const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const RegisterModel = require('../api/models/user');
const RegisterService = require('../api/services/user');
const ApiError = require('../api/error/apiError');
const { USER_DOES_NOT_EXIST } = require('../api/error/msgCodeError');

describe('Testes de verificação da camada service para registro e login:', function () {
  let connectionMock;

  const payload = {
    email: 'cslcristiano@gmail.com',
    password: '123456',
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
    sinon.stub(ApiError, 'SendToErrorMiddleware').resolves(USER_DOES_NOT_EXIST);

    await RegisterModel.register({
      name: 'Cristiano',
      email: 'cslcristiano@gmail.com',
      password: '123456',
      securityPhrase: 'meu-segredo',
    });
  });

  afterAll(function () {
    ApiError.SendToErrorMiddleware.restore();
  });

  describe('- ao realizar o login com sucesso, verifica que o método login', function () {
    test('retorna as chaves "name" e "token"', async function () {
      const response = await RegisterService.login({ ...payload }); // nesse caso, o uso de cópia (spread) não faz diferença.

      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('token');
    });
  });

  describe('- ao realizar o login com um email que não existe no banco de dados', function () {
    test('retorna um código e uma mensagem de erro', async function () {
      const response = await RegisterService.login({
        email: 'email_diferente@gmail.com',
        senha: '123456',
      });

      expect(response).toHaveProperty('code');
      expect(response).toHaveProperty('message');
      expect(response.code).toEqual(USER_DOES_NOT_EXIST.code);
      expect(response.message).toEqual(USER_DOES_NOT_EXIST.message);
    });
  });
});