const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const model = require('../api/models/patient');

describe('Testes de verificação da camada model para registro de pacientes', function () {
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
    servicePending: {
      weekly: 0,
      monthly: 0,
    },
    healthInsurance: 'saude & suporte',
    unitPrice: 40.00,
    totalPrice: 0,
    evolution: '',
  };
  
  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = await MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    response = await model.registerPatient({ ...payload });
  });
  
  afterAll(function () {
    MongoClient.connect.restore();
  });
    
  describe('- Register: ao realizar o cadastro', function () {
    test('garante que um documento é inserido no banco de dados:', async function () {
      const db = await connectionMock.db('HomeCareDB');
      const coll = await db.collection('patients');
      const result = await coll.findOne({ patient: 'Maria' });

      expect(result).not.toBe(null);
    });

    test('garante que o método register possui uma propriedade \'_id\'', async function () {
      const { _id: idValue } = response;

      expect(response).toHaveProperty('_id', idValue);
    });
  });
});
