const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const { TOKEN_NOT_FOUND, INVALID_TOKEN } = require('../api/error/msgCodeError');
const { authentication } = require('../api/middlewares/auth');

describe('Teste da função authentication', function () {
  let connectionMock;
  let request = {};
  let response = {};

  const authPayload = {
    _id: '6282d5893854824c30bfe84f',
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
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

    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();

    request.user = { ...authPayload };
  });

  test('- retorna status 401 e uma mensagem de erro, se o token não for encontrado',
  async function () {
    try {
      request = { headers: {} };
      response = {};
      const next = () => {};
      authentication(request, response, next);
    } catch (error) {
      expect(error.code).toEqual(401);
      expect(error.message).toEqual('Token não encontrado!');
    }
  });

  test('- verifica que o token é validado e retorna chave user com dados do usuário',
  async function () {
    sinon.stub(jwt, 'sign').resolves('um token qualquer gerado com sucesso');
    sinon.stub(jwt, 'verify').resolves({ ...authPayload });
    request = { headers: { authorization: 'token inválido' } };
    response = {};
    const next = () => {};
    await authentication(request, response, next);

    expect(request).toHaveProperty('user');
  });

  test('- retorna uma mensagem de erro, se o token não for encontrado', async function () {
    request = { headers: { authorization: '' } };
    const spy = sinon.spy();
      spy(TOKEN_NOT_FOUND);

      sinon.assert.calledWith(spy,
        sinon.match.has(
          'message',
          'Token não encontrado!',
          ));
  });

  test('- retorna uma mensagem de erro, se o token for inválido', async function () {
    request = { headers: { authorization: 'inválido' } };
    const spy = sinon.spy();
      spy(INVALID_TOKEN);

      sinon.assert.calledWith(spy,
        sinon.match.has(
          'message',
          'Token inválido ou expirado!',
          ));
  });
});
