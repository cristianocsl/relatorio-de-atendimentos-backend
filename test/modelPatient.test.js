const { ObjectId } = require('mongodb');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { updatePatient, registerPatient } = require('../api/models/patient');

describe('Testes de verificação da camada model para registro de pacientes', function () {
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
    response = await registerPatient({ ...payload });
  });
  
  // afterAll(function () {
  //   MongoClient.connect.restore();
  // });
    
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

  describe('- Update: ao atualizar os dados de um pacient:', function () {
    test('- os valores são atualizados no banco de dados', async function () {
      sinon.stub(ObjectId, 'isValid').returns(true);

      const { _id: pacientId } = response;

      await updatePatient(
        pacientId, { ...payload, servicePerformed: { weekly: 1, monthly: 0 } },
      ); 
      const db = await connectionMock.db('HomeCareDB');
      const coll = await db.collection('patients');
      const patient = await coll.findOne({ patient: 'Maria' });

      expect(patient.servicePerformed.weekly).toEqual(1);
      ObjectId.isValid.restore();
    });

    test('- retorna NULL se o _id for de formato inválido', async function () {
      const result = await updatePatient(
        'qualquerIdInválido', { ...payload, servicePerformed: { weekly: 1, monthly: 0 } },
      );

      expect(result).toBe(null);
    });
  });
});
