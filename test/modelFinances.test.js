const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { registerFinances, getFinances } = require('../api/models/finances');
const { register } = require('../api/models/user');

describe('Testes de verificação da camada model de finanças', function () {
  let connectionMock;
  let response;
  
  const payload = {
    patientId: '8c9f9f8f9f9f9f9f9f9f9f87',
    userId: '6c9f9f8f9f9f9f9f9f9f9f96',
    prevTotalPrice: '',
    doneTotalPrice: '',
    healthInsurance: 'saude & suporte',
    unitPrice: 40.00,
    totalPrice: 0,
  };
  
  beforeAll(async function () {
    const DBSERVER = await MongoMemoryServer.create();
    const URLMock = DBSERVER.getUri();
    connectionMock = await MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    response = await registerFinances({ ...payload });
  });
    
  describe('- Register: ao realizar o cadastro', function () {
    test('garante que um documento é inserido no banco de dados:', async function () {
      const db = await connectionMock.db('HomeCareDB');
      const coll = await db.collection('finances');
      const result = await coll.findOne({ userId: '6c9f9f8f9f9f9f9f9f9f9f96' });
      
      expect(result).not.toBe(null);
    });
    
    test('garante que o método register possui uma propriedade \'_id\'', async function () {
      const { _id: idValue } = response;
      
      expect(response).toHaveProperty('_id', idValue);
    });
  });

  describe('- getFinances: ao buscar todos dados de finanças de um usuário:', function () {
    test('- retorna um array com todas as finanças', async function () {
      const { _id: userId } = await register({
        name: 'Usuário 1',
        email: 'usuario_1@email.com',
        password: '123456',
      });

      await registerFinances({ ...payload, userId });

      const result = await getFinances(userId);
      expect(result).toHaveLength(1);
    });
  });
});
