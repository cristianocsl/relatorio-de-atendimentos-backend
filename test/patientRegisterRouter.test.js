const bcrypt = require('bcrypt');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const RegisterModel = require('../api/models/user');

describe('Testando a rota /registerPatient:', function () {
  let connectionMock;
  let response = {};
  
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
    
    response = await request(app)
      .post('/registerPatient')
      .send({ ...payload })
      .set('authorization', token);
  });
  
  test('- retorna statusCode 201', async function () {
    expect(response.statusCode).toBe(201);
  });

  test('- retorna um body com a propriedade "message"', async function () {
    expect(response.body).toHaveProperty('message');
  });

  test('- retorna uma mensagem de sucesso', async function () {
    expect(response.body.message).toStrictEqual('Paciente cadastrado com sucesso!');
  });
});
