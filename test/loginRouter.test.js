const bcrypt = require('bcrypt');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const RegisterModel = require('../api/models/user');

const app = require('../server');

describe('Testando a rota /login:', function () {
  let connectionMock;
  let response = {};

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

    response = await request(app)
      .post('/login')
      .send({
        email: 'cslcristiano@gmail.com',
        password: '123456',
      });
  });

  test('retorna statusCode 200', async function () {
    expect(response.statusCode).toBe(200);
  });

  test('retorna um body com a propriedade "name"', async function () {
    expect(response.body).toHaveProperty('name');
  });
  
  test('retorna um body com a propriedade "token"', async function () {
    expect(response.body).toHaveProperty('token');
  });
});
