const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const RegisterService = require('../api/services/user');
const { EMAIL_EXISTING } = require('../api/error/msgCodeError');

describe('Testes de verificação da camada service para registro:', function () {
  let connectionMock;

  const payload = {
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
    securityPhrase: 'meu-segredo',
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
  });

  describe('- ao realizar o cadastro verifica que o método register', function () {
    test('retorna o nome do usuário em caso de sucesso!', async function () {
      const response = await RegisterService.register(payload);

      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('email');
      expect(response).toHaveProperty('userId');
      expect(response).toHaveProperty('message');
      expect(response.name).toEqual('Cristiano');
      expect(response.message)
        .toEqual(`Parabéns, ${response.name}! Seu cadastro foi realizado com sucesso!`);
    });
  });

  describe('- ao realizar um cadastro com um email que já existe no banco de dados', function () {
    test('retorna um código e uma mensagem de erro', async function () {
      try {
        await RegisterService.register(payload);
      } catch (error) {
      expect(error.code).toEqual(EMAIL_EXISTING.code);
      expect(error.message).toEqual(EMAIL_EXISTING.message);
      }
    });
  });
});
