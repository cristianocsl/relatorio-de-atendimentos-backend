const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const ApiError = require('../api/error/apiError');
const { EMAIL_EXISTING } = require('../api/error/msgCodeError');
const app = require('../server');

describe('Testando o servidor', function () {
  let connectionMock;

  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    sinon.stub(ApiError, 'SendToErrorMiddleware').resolves(EMAIL_EXISTING);
  });

  afterAll(async function () {
    MongoClient.connect.restore();
  });

  test('acessando a rota /register', async function () {
    const response = await request(app)
      .post('/register')
      .send({
        name: 'Cristiano',
        email: 'cslcristiano@gmail.com',
        password: '123456',
        securityPhrase: 'meu-segredo',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message');
  });
});
