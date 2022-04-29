const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const RegisterModel = require('../api/models/user');
const RegisterService = require('../api/services/user');
const { ApiError } = require('../api/error/apiError');
const { EMAIL_EXISTING } = require('../api/error/msgCodeError');

describe('Testes de verificação da camada service para registro e login:', function () {
  let connectionMock;

  const ID_TEST = '12hg43k43ji43ij45jg67uh3';
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
    sinon.stub(RegisterModel, 'register').resolves(ID_TEST);
    sinon.stub(RegisterModel, 'findUserByEmail').resolves('outroemail@gmail.com');
    sinon.stub(ApiError, 'SendToErrorMiddleware').resolves(EMAIL_EXISTING);
  });

  afterAll(function () {
    RegisterModel.register.restore();
    RegisterModel.findUserByEmail.restore();
    ApiError.SendToErrorMiddleware.restore();
  });

  describe('- ao realizar o cadastro', function () {
    test('verifica o funcionamento do método register', async function () {
      const response = await RegisterService.register(payload);

      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('token');
      expect(response.name).toEqual('Cristiano');
    });
  });

  describe('- ao realizar um cadastro com um email que já existe no banco de dados', function () {
    test('retorna um código e uma mensagem de erro', async function () {
      await RegisterModel.findUserByEmail('cslcristiano@gmail.com');
      const response = await RegisterService.register(payload);
      expect(response).toHaveProperty('code');
      expect(response).toHaveProperty('code');
      expect(response.code).toEqual(EMAIL_EXISTING.code);
      expect(response.message).toEqual(EMAIL_EXISTING.message);
    });
  });
});