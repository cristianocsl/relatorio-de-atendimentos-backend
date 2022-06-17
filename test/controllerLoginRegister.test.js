const sinon = require('sinon');
const { BAD_REQUEST, CREATED, OK } = require('http-status-codes').StatusCodes;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { USER_DOES_NOT_EXIST, INCORRECT_PASSWORD } = require('../api/error/msgCodeError');

const controller = require('../api/controllers/user');

describe('Testando a camada controller para registro e login de usuário', function () {
  let connectionMock;
  
  const payload = {
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
    securityPhrase: 'meu-segredo',
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

    await controller.register(request, response);
  });

  describe('- Register: ao chamar o controller de register com um body vazio:', function () {
    test('retorna resposta com status 400', async function () {
      request.body = {};
      expect(response.status.calledWith(BAD_REQUEST)).toBe(true);
    });
  });

  describe('- Register: ao realizar o cadastro com sucesso', function () {
    test('retorna resposta com status 201', async function () {
      request.body = { ...payload };
      await controller.register(request, response);
      expect(response.status.calledWith(CREATED)).toBe(true);
    });
  });
  
  describe('- Login: ao realizar o login com sucesso', function () {
    test('retorna resposta com status 200', async function () {
      request.body = { ...payload };
      await controller.login(request, response);
      
      expect(response.status.calledWith(OK)).toBe(true);
    });
  });
  
  describe('- Login: em caso de falha', function () {
    test('retorna resposta com status 404, se o email for inexistente', async function () {
      request.body = { email: 'email_inexistente@gmail.com', password: payload.password };
      await controller.login(request, response);

      expect(response.status.calledWith(404)).toBe(true);
    });

    test(
      'retorna uma chave "message" com uma mensagem de erro, se a senha está incorreta',
      async function () {
      const spy = sinon.spy();
      spy(INCORRECT_PASSWORD);

      sinon.assert.calledWith(spy,
        sinon.match.has(
          'message',
          'Senha incorreta!',
        ));
      },
    );

    test(
      'retorna uma chave "message" com uma mensagem de erro, se o email não existe',
      async function () {
      const spy = sinon.spy();
      spy(USER_DOES_NOT_EXIST);

      sinon.assert.calledWith(spy,
        sinon.match.has(
          'message',
          'Usuário não existe ou email está incorreto!',
        ));
      },
    );

    test('retorna resposta com status 400, se a senha for incorreta', async function () {
      request.body = { email: payload.email, password: 'xxxxxx' };
      await controller.login(request, response);
      expect(response.status.calledWith(BAD_REQUEST)).toBe(true);
    });
  });
});