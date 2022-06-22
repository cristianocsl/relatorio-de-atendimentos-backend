const bcrypt = require('bcrypt');

const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { NOT_FOUND, BAD_REQUEST } = require('http-status-codes').StatusCodes;

const {
  USER_DOES_NOT_EXIST, INCORRECT_PASSWORD,
} = require('../api/error/msgCodeError');

const RegisterModel = require('../api/models/user');
const UserService = require('../api/services/user');

describe('Testes de verificação da camada service para login:', function () {
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
    
    sinon.stub(MongoClient, 'connect').returns(connectionMock);
    sinon.stub(bcrypt, 'compare')
      .onCall(0)
        .returns(true)
      .onCall(1)
        .returns(false);
        
        await RegisterModel.register(payload);
      });
      
      afterAll(async function () {
        MongoClient.connect.restore();
        bcrypt.compare.restore();
      });
  
    describe('- ao realizar o login com email no formato inválido', function () {
      test('retorna mensagem de erro', async function () {
        try {
          await UserService.login({
            email: 'cristiano_gmail.com',
            password: '123456',
          });
        } catch (error) {
          expect(error.message).toEqual('Formato de e-mail inválido!');
          expect(error.code).toEqual(BAD_REQUEST);
        }
      });
    });
      
      describe('- ao realizar o login com sucesso, verifica que o método login', function () {
    test('retorna as chaves "name" e "token"', async function () {
      const response = await UserService.login({
        email: payload.email,
        password: payload.password,
      });

      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('token');
    });
  });

  describe('- ao realizar o login com body vazio', function () {
    test('retorna mensagem de erro', async function () {
      try {
        await UserService.login({
          email: '',
          password: '',
        });
      } catch (error) {
        expect(error.message).toEqual('Este campo não pode ser vazio!');
        expect(error.code).toEqual(NOT_FOUND);
      }
    });
  });

  describe('- ao realizar o login com um email que não existe no banco de dados', function () {
    test('retorna um código e uma mensagem de erro', async function () {
      try {
        await UserService.login({
          email: 'email_diferente@gmail.com',
          password: '123456',
        });
      } catch (error) {
        expect(error.code).toEqual(USER_DOES_NOT_EXIST.code);
        expect(error.message).toEqual(USER_DOES_NOT_EXIST.message);
      }
    });
  });
  
  describe('- ao realizar o login com uma senha errada', function () {
    test('retorna um código e uma mensagem de erro', async function () {
      try {
        await UserService.login({
          email: payload.email,
          password: 'xxxxxx',
        });
      } catch (error) {
        expect(error.code).toEqual(INCORRECT_PASSWORD.code);
        expect(error.message).toEqual(INCORRECT_PASSWORD.message);
      }
    });
  });
});