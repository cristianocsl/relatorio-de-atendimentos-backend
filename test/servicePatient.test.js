const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const service = require('../api/services/patient');
const modelPatient = require('../api/models/patient');

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
    
    response = await service.registerPatient(payload);
  });

  afterAll(async function () {
   MongoClient.connect.restore();
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
    test('retorna a chave "neighborhood"', async function () {
      expect(response).toHaveProperty('neighborhood');
    });
    test('retorna a chave "message" com mensagem de sucesso', async function () {
      expect(response).toHaveProperty('message');
      expect(response.message).toEqual('Paciente cadastrado com sucesso!');
    });
  });

  describe('- ao atualizar os dados de um paciente com sucesso:', function () {
    test('- retorna a propriedade atualizada', async function () {
      const { _id } = response;

      const result = await service.updatePatient(_id, {
        servicePerformed: { weekly: 1, monthly: 0 },
      });
      const find = await modelPatient.findPatientById(_id);

      expect(result.servicePerformed).toEqual(find.servicePerformed);
    });
  });
});
