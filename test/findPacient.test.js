const bcrypt = require('bcrypt');
const request = require('supertest');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { findPatient } = require('../api/models/patient/findPatient');
const app = require('../server');
const RegisterModel = require('../api/models/user');

describe('Testando a função findPatient', function () {
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

    sinon.stub(bcrypt, 'compare').returns(true);
    
    await RegisterModel.register({
      name: 'Cristiano',
      email: 'cslcristiano@gmail.com',
      password: '123456',
      securityPhrase: 'meu-segredo',
    });
    
    const { body: { token } } = await request(app)
      .post('/login')
      .send({
        email: 'cslcristiano@gmail.com',
        password: '123456',
      });
    
    await request(app)
      .post('/registerPatient')
      .send({ ...payload })
      .set('authorization', token);
  });
  
  afterAll(function () {
      MongoClient.connect.restore();
  });
  
  test('- retorna um paciente previamente cadastrado:', async function () {
    const result = await findPatient({ patient: payload.patient });
    expect(result).not.toBe(null);
  });

  test('- retorna NULL se o paciente não existir no banco de dados:', async function () {
    const result = await findPatient({ patient: 'Fulano' });
    expect(result).toBe(null);
  });
});