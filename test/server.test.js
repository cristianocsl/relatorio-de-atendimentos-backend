const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const successMsg = require('../api/services/utilities/successMsg');
const app = require('../server');

describe('Testando a rota /register:', function () {
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

    response = await request(app)
      .post('/register')
      .send({
        name: 'Cristiano',
        email: 'cslcristiano@gmail.com',
        password: '123456',
        securityPhrase: 'meu-segredo',
      });
  });

  test('retorna statusCode 201', async function () {
    expect(response.statusCode).toBe(201);
  });

  test('retorna um body com a propriedade "message"', async function () {
    expect(response.body).toHaveProperty('message');
  });

  test('retorna uma mensagem de sucesso', async function () {
    expect({ message: response.body.message }).toStrictEqual(successMsg('Cristiano'));
  });
});
