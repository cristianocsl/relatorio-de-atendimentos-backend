/* eslint-disable mocha/no-mocha-arrows */
const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./modelConnection');

const { register } = require('../api/models/user');

describe('Quando um usuário é cadastrado,', () => {
  let connectionMock;

  const payload = {
    name: 'João',
    email: 'joaojoao@gmail.com',
    password: '123456',
    confirmPassword: '123456',
    securityPhrase: 'meu-segredo',
  };

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('verifica que', () => {
    it('retorna um objeto com a chave _id', async () => {
      const response = await register({ ...payload });

      expect(response).to.have.a.property('_id');
    });
  });

  // describe('quando ocorre algum erro no cadastro,', () => {
  //   it('teste 1', async () => {
  //     // const response = await register({ ...emptyField });
  //     // expect(response).to.be.empty();
  //   });
  //   it('teste 2', async () => {

  //   });
  //   it('teste 3', async () => {

  //   });
  //   it('teste 4', async () => {

  //   });
  // });
});
