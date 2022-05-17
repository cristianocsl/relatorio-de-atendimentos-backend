const sinon = require('sinon');
const { BAD_REQUEST, CREATED, OK } = require('http-status-codes').StatusCodes;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const writeSuccessMsg = require('../api/services/utilities/successMsg');

const registerController = require('../api/controllers/user');
const loginController = require('../api/controllers/user');

describe('Testando a camada controller para registro e login de usuário', function () {
  let connectionMock;
  
  const BODY = {
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
    securityPhrase: 'meu-segredo',
  };

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
  });

  describe('- Register: ao chamar o controller de create com payload inválido:', function () {
    const request = {};
    const response = {};
    
    test('retorna resposta com status 400', async function () {
      request.body = {};
  
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      await registerController.register(request, response);

      expect(response.status.calledWith(BAD_REQUEST)).toBe(true);
    });
  });

  describe('- Register: ao realizar o cadastro com sucesso', function () {
    const request = {};
    const response = {};

    beforeAll(function () {
      request.body = { ...BODY };

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
    });

    test('retorna resposta com status 201', async function () {
      await registerController.register(request, response);

      expect(response.status.calledWith(CREATED)).toBe(true);
    });

    test('retorna mensagem de sucesso', async function () {
      await registerController.register(request, response);

      expect(response.json.calledWith(writeSuccessMsg(BODY.name))).toBe(true);
    });
  });

  describe('- Login: ao realizar o login com sucesso', function () {
    const request = {};
    const response = {};

    beforeAll(function () {
      request.body = { ...payload };

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
    });

    test('retorna resposta com status 200', async function () {
      await loginController.register(request, response);

      expect(response.status.calledWith(OK)).toBe(true);
    });

    test('retorna as propriedades name e token', async function () {
      await loginController.register(request, response);

      expect(response.json).toHaveProperty('name');
      expect(response.json).toHaveProperty('token');
    });
  });
});