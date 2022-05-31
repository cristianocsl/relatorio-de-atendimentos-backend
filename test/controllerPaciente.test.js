const sinon = require('sinon');
const { BAD_REQUEST, CREATED } = require('http-status-codes').StatusCodes;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const auth = require('../api/middlewares/auth');

const controller = require('../api/controllers/patient');

describe('Testando a camada controller para registro e login de usuário', function () {
  let connectionMock;
  
  const payload = {
    patient: 'Maria',
    days: [1, 4],
    serviceGoal: {
      weekly: 3,
      monthly: 12,
    },
    servicePerformed: {
      weekly: 0,
      monthly: 0,
    },
    healthInsurance: 'saude & suporte',
    unitPrice: 40.00,
    evolution: '',
  };

  const authPayload = {
    _id: '6282d5893854824c30bfe84f',
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
  };

  const request = {};
  const response = {};
  
  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    sinon.stub(auth, 'authentication').returns(authPayload);

    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();

    request.user = { _id: '6282d5893854824c30bfe84f' };
    await controller.registerPatient(request, response);
  });

  describe('- Registro: ao chamar o controller de registerPatient com um body vazio:', function () {
    test('retorna resposta com status 400', async function () {
      request.body = {};
      expect(response.status.calledWith(BAD_REQUEST)).toBe(true);
    });
  });

  describe('- Registro: ao realizar o cadastro com sucesso', function () {
    beforeAll(async function () {
      request.body = { ...payload };
      await controller.registerPatient(request, response);
    });

    afterAll(function () {
      request.body = {};
    });
    
    test('retorna resposta com status 201', async function () {
      expect(response.status.calledWith(CREATED)).toBe(true);
    });
  });
});
