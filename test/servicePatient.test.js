const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { CONFLICT } = require('http-status-codes').StatusCodes;

const service = require('../api/services/patient');
const modelPatient = require('../api/models/patient');

const { INEXISTING_PATIENT, USERID_DOES_NOT_MATCH } = require('../api/error/msgCodeError');

describe('Testes da camada service: registro, atualização e busca de paciente:', function () {
  let connectionMock;
  let response;

  const payload = {
    patient: 'Maria',
    neighborhood: 'Farol',
    status: 'Ativo',
    priority: 'Urgente',
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
    userId: '5c9f9f8f9f9f9f9f9f9f9f94',
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
    test('retorna a chave "status"', async function () {
      expect(response).toHaveProperty('status');
    });
    test('retorna a chave "priority"', async function () {
      expect(response).toHaveProperty('priority');
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
        ...payload,
        servicePerformed: { weekly: 1, monthly: 0 },
      });

      const find = await modelPatient.findPatientById(_id);

      expect(result.servicePerformed).toEqual(find.servicePerformed);
    });
  });
  
  describe('- casos de falha ao atualizar:', function () {
    test('- retorna um erro se o id do paciente não existir ou for inválido', async function () {
      try {
        await service.updatePatient('a1s23d12ds32ds32ds32ds32d', {
          servicePerformed: { weekly: 1, monthly: 0 },
        });
      } catch (error) {
        expect(error.code).toEqual(INEXISTING_PATIENT.code);
        expect(error.message).toEqual(INEXISTING_PATIENT.message);
      }
    });

    test('- retorna erro se o userId não conferir nas informações do paciente', async function () {
      try {
        response = {};
        response = await service.registerPatient(
          { ...payload, patient: 'novo paciente', userId: '6c9f9f8f9f9f9f9f9f9f9f96' },
          );
          
          const { _id: validId } = response;
          
          await service.updatePatient(validId, {
            servicePerformed: { weekly: 1, monthly: 0 },
          });
      } catch (error) {
        expect(error).toHaveProperty('code');
        expect(error).toHaveProperty('message');
        expect(error.code).toEqual(USERID_DOES_NOT_MATCH.code);
        expect(error.message).toEqual(USERID_DOES_NOT_MATCH.message);
      }
    });
  });

  describe('Ao cadastrar um paciente que já existe no bando de dados:', function () {
    test('- retorna mensagem de erro e um código:', async function () {
      try {
        await service.registerPatient(payload);
      } catch (error) {
      expect(error.code).toEqual(CONFLICT);
      expect(error.message).toEqual('Paciente já cadastrado!');
      }
    });
  });

  describe('GetAllPatientsFromUserId: ao buscar um paciente pelo id do usuário:', function () {
    test('- retorna um array de pacientes.', async function () {
      await service.registerPatient(
        { ...payload, patient: 'paciente segundo', userId: '5c9f9f8f9f9f9f9f9f9f9f93' },
      );
      const result = await service.getAllPatientsFromUserId('5c9f9f8f9f9f9f9f9f9f9f93');

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });
});
