const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const service = require('../api/services/patient');

describe('Testes de verificação da camada service para registro de paciente:', function () {
  let connectionMock;
  let response;

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

  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    response = await service.registerPatient(payload);
  });

  describe('- ao realizar o cadastro de um paciente, verifica que o método register', function () {
    test('retorna a chave "patient e nome do paciente"', async function () {
      expect(response).toHaveProperty('patient');
      expect(response.patient).toEqual('Maria');
    });
    test('retorna a chave "days"', async function () {
      expect(response).toHaveProperty('days');
    });
    test('retorna a chave "serviceGoal"', async function () {
      expect(response).toHaveProperty('serviceGoal');
    });
    test('retorna a chave "servicePerformed"', async function () {
      expect(response).toHaveProperty('servicePerformed');
    });
    test('retorna a chave "servicePending"', async function () {
      expect(response).toHaveProperty('servicePending');
    });
    test('retorna a chave "healthInsurance"', async function () {
      expect(response).toHaveProperty('healthInsurance');
    });
    test('retorna a chave "unitPrice"', async function () {
      expect(response).toHaveProperty('unitPrice');
    });
    test('retorna a chave "prevTotalPrice"', async function () {
      expect(response).toHaveProperty('prevTotalPrice');
    });
    test('retorna a chave "doneTotalPrice"', async function () {
      expect(response).toHaveProperty('doneTotalPrice');
    });
    test('retorna a chave "evolution"', async function () {
      expect(response).toHaveProperty('evolution');
    });
  });
});
