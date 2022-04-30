const sinon = require('sinon');
const { BAD_REQUEST, CREATED } = require('http-status-codes').StatusCodes;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const writeSuccessMsg = require('../api/services/utilities/successMsg');

const RegisterModel = require('../api/models/user');
const RegisterService = require('../api/services/user');
const registerController = require('../api/controllers/user');

describe('Testando a camada controller do usuário', function () {
  let connectionMock;

  const ID_TEST = '12hg43k43ji43ij45jg67uh3';
  
  const BODY = {
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
    sinon.stub(RegisterService, 'register').resolves(false);
  });

  afterAll(function () {
    RegisterModel.register.restore();
    RegisterModel.findUserByEmail.restore();
    RegisterService.register.restore();
  });

  describe('- ao chamar o controller de create com payload inválido:', function () {
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

  describe('- ao realizar o cadastro com sucesso', function () {
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
});