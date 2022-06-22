const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { BAD_REQUEST, NOT_FOUND } = require('http-status-codes').StatusCodes;

const RegisterService = require('../api/services/user');
const { EMAIL_EXISTING } = require('../api/error/msgCodeError');

describe('Testes de verificação da camada service para registro:', function () {
  let connectionMock;

  const payload = {
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
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

  describe('- ao realizar o registro com email no formato inválido', function () {
    test('retorna mensagem de erro', async function () {
      try {
        await RegisterService.register({
          name: 'Cristiano',
          email: 'cristiano_gmail.com',
          password: '123456',
        });
      } catch (error) {
        expect(error.message).toEqual('Formato de e-mail inválido!');
        expect(error.code).toEqual(BAD_REQUEST);
      }
    });
  });

  describe('- ao realizar o registro com campos vazios', function () {
    test('retorna mensagem de erro', async function () {
      try {
        await RegisterService.register({
          name: '',
          email: '',
          password: '',
        });
      } catch (error) {
        expect(error.message).toEqual('Este campo não pode ser vazio!');
        expect(error.code).toEqual(NOT_FOUND);
      }
    });
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
