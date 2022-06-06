const sinon = require('sinon');
const { CONFLICT } = require('http-status-codes').StatusCodes;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const service = require('../api/services/patient');
const ApiError = require('../api/error/apiError');
const { EXISTING_PATIENT } = require('../api/error/msgCodeError');

describe('Testes de verificação da camada service para registro de paciente:', function () {
  let connectionMock;

  const payload = {
    patient: 'Maria',
    neighborhood: 'Farol',
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

  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);

    sinon.stub(ApiError, 'SendToErrorMiddleware').resolves(EXISTING_PATIENT);
    await service.registerPatient(payload);
  });
  
  afterAll(async function () {
    MongoClient.connect.restore();
    ApiError.SendToErrorMiddleware.restore();
  });
  
  describe('Ao cadastrar um paciente que já existe no bando de dados:', function () {
    test('- retorna mensagem de erro e um código:', async function () {
      const response = await service.registerPatient(payload);
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('code');
      expect(response.code).toEqual(CONFLICT);
      expect(response.message).toEqual('Paciente já cadastrado!');
    });
  });
});
