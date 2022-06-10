const sinon = require('sinon');
const { NOT_FOUND } = require('http-status-codes').StatusCodes;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const controllerPati = require('../api/controllers/patient');

const { INEXISTING_PATIENT, USERID_DOES_NOT_MATCH } = require('../api/error/msgCodeError');
const servicePatient = require('../api/services/patient');

describe('Casos de falha da camada controller na atualização de dados de paciente.', function () {
  let connectionMock;
  
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
    
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();

    request.user = {};
    request.body = {};
    await controllerPati.registerPatient(request, response);
  });
  
  describe('- Casos de falha ao atualizar o cadastro:', function () {
    beforeAll(async function () {
      request.user = {};
      request.body = {};
      request.params = { patientId: '5e9f8b9b8b8b8b8b8b8b8b8' };
      sinon.stub(servicePatient, 'registerPatient')
        .onCall(0)
          .returns(INEXISTING_PATIENT)
        .onCall(1)
          .returns(USERID_DOES_NOT_MATCH);
      await controllerPati.updatePatient(request, response);
    });

    test('- retorna resposta com status 404, se o paciente não existir no bd', async function () {
      expect(response.status.calledWith(NOT_FOUND)).toBe(true);
    });

    test('- retorna resposta com status 404, se o id do usuário não confere',
    async function () {
      expect(response.status.calledWith(NOT_FOUND)).toBe(true);
    });
  });
});
