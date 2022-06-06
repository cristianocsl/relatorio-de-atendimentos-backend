const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const service = require('../api/services/patient');
const ApiError = require('../api/error/apiError');
const {
  INEXISTING_PATIENT, USERID_DOES_NOT_MATCH,
} = require('../api/error/msgCodeError');

describe('Testes da camada service: registro e atualização de paciente:', function () {
  let connectionMock;
  let response;

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
    userId: '5c9f9f8f9f9f9f9f9f9f9f93',
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
    sinon.stub(ApiError, 'SendToErrorMiddleware')
      .onCall(0)
        .resolves(INEXISTING_PATIENT)
      .onCall(1)
        .resolves(USERID_DOES_NOT_MATCH);

    response = await service.registerPatient(payload);
  });

  afterAll(async function () {
    MongoClient.connect.restore();
    ApiError.SendToErrorMiddleware.restore();
  });
  
    describe('- casos de falha ao atualizar:', function () {
    test('- retorna um erro se o id do paciente não existir ou for inválido', async function () {
      const result = await service.updatePatient('a1s23d12ds32ds32ds32ds32d', {
        servicePerformed: { weekly: 1, monthly: 0 },
      });

      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('message');
      expect(result.code).toEqual(INEXISTING_PATIENT.code);
      expect(result.message).toEqual(INEXISTING_PATIENT.message);
    });

    test('- retorna erro se o userId não conferir nas informações do paciente', async function () {
      response = {};
      response = await service.registerPatient(
        { ...payload, patient: 'novo paciente', userId: '6c9f9f8f9f9f9f9f9f9f9f96' },
      );
      
      const { _id: validId } = response;
      
      const result = await service.updatePatient(validId, {
        servicePerformed: { weekly: 1, monthly: 0 },
      });
      
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('message');
      expect(result.code).toEqual(USERID_DOES_NOT_MATCH.code);
      expect(result.message).toEqual(USERID_DOES_NOT_MATCH.message);
    });
  });
});
