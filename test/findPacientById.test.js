const bcrypt = require('bcrypt');
const request = require('supertest');
const sinon = require('sinon');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { findPatientById } = require('../api/models/patient');
const app = require('../server');
const RegisterModel = require('../api/models/user');

describe('Testando a função findPatientById', function () {
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
    sinon.stub(bcrypt, 'compare').returns(true);
    
    await RegisterModel.register({
      name: 'Cristiano',
      email: 'cslcristiano@gmail.com',
      password: '123456',
    });
    
    const { body: { token } } = await request(app)
      .post('/login')
      .send({
        email: 'cslcristiano@gmail.com',
        password: '123456',
      });
    
    response = await request(app)
      .post('/registerPatient')
      .send({ ...payload })
      .set('authorization', token);
  });
  
  afterAll(function () {
      MongoClient.connect.restore();
      ObjectId.isValid.restore();
  });
  
  test('- retorna um paciente previamente cadastrado', async function () {
    sinon.stub(ObjectId, 'isValid').returns(true);

    const { _id } = response.body;
    const result = await findPatientById(_id);
    expect(result).not.toBe(null);
  });
  
  test('- retorna NULL se não existe paciente com o _id informado', async function () {
    const result = await findPatientById('123456789123456789123456');
    expect(result).toBe(null);
  });
});