const sinon = require('sinon');

const RegisterModel = require('../api/models/user');
const RegisterService = require('../api/services/user');

jest.useRealTimers();

describe('Testes de verificação da camada service para registro e login:', function () {
  const payload = {
    _id: '604cb554311d68f491ba5781',
    name: 'Cristiano',
    email: 'cslcristiano@gmail.com',
    password: '123456',
    confirmPassword: '123456',
    securityPhrase: 'meu-segredo',
  };

  beforeAll(async function () {
    sinon.stub(RegisterModel, 'register').resolves({ ...payload });

    sinon.stub(RegisterModel, 'findUserByEmail').resolves({ ...payload });
    console.log(RegisterService.register(payload));
  });

  afterAll(function () {
    RegisterModel.register.restore();
  });

  describe('- ao realizar o cadastro', function () {
    test('verifica o funcionamento do método register', async function () {
      const response = await RegisterService.register({ ...payload });
      expect(response.name).toEqual('Cristiano');
      console.log(response);
      expect(response.token).toEqual('abc');
    });
  });
});
