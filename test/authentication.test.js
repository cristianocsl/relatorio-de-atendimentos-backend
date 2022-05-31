const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const { TOKEN_NOT_FOUND } = require('../api/error/msgCodeError');
const ApiError = require('../api/error/apiError');
const controller = require('../api/controllers/user');

describe('Teste da função authentication', function () {
  let connectionMock;
  let request = {};

  const response = {};

  const authPayload = {
    _id: '6282d5893854824c30bfe84f',
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
  };

  const loginPayload = {
    name: 'Cristiano',
    token: 'shflskjfsldf1208909098sad',
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
    sinon.stub(ApiError, 'SendToErrorMiddleware').returns(TOKEN_NOT_FOUND);
    sinon.stub(controller, 'login').returns(loginPayload);

    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();

    request.user = { ...authPayload };
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
});
