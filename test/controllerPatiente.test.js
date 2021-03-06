const sinon = require('sinon');
const { BAD_REQUEST, CREATED, OK, CONFLICT } = require('http-status-codes').StatusCodes;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const controller = require('../api/controllers/patient');
const { EMPTY_BODY } = require('../api/error/msgCodeError');

describe('Testes da camada controller: registro de dados de paciente.', function () {
  let connectionMock;
  
  const payload = {
    patient: 'Maria',
    neighborhood: 'Farol',
    status: {},
    activeService: 'Sim',
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

    request.body = {};
    request.user = {};
  });
  
  describe('- Registro: ao chamar o controller de registerPatient com um body vazio:', function () {
    test('retorna resposta com status 400', async function () {
      request.body = {};
      await controller.registerPatient(request, response);
      expect(response.status.calledWith(BAD_REQUEST)).toBe(true);
    });
    
    test(
      'retorna uma chave "message" com uma mensagem de erro, se o body for vazio',
      async function () {
        const spy = sinon.spy();
        spy(EMPTY_BODY);
        
        sinon.assert.calledWith(spy,
          sinon.match.has(
          'message',
          'Não é possível cadastrar um usuário com campos vazios!',
          ));
      },
    );
  });
    
  describe('- Registro: ao realizar o cadastro com sucesso', function () {
    test('retorna resposta com status 201', async function () {
      request.body = { ...payload };
      await controller.registerPatient(request, response);
      expect(response.status.calledWith(CREATED)).toBe(true);
    });
    
    test('retorna resposta com status 409, se o paciente já está cadastrado', async function () {
      request.body = { ...payload };
      await controller.registerPatient(request, response);
      expect(response.status.calledWith(CONFLICT)).toBe(true);
    });
  });

  describe('- GetAll: ao chamar o controller de getAllPatients', function () {
    test('retorna resposta com status 200 em caso de sucesso', async function () {
      await controller.getAllPatientsFromUserId(request, response);
      expect(response.status.calledWith(OK)).toBe(true);
    });
  });
});
