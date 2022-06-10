const bcrypt = require('bcrypt');
const { comparator, encryptor } = require('../api/services/utilities/bcryptFunction');

describe('Teste das funções encryptor e comparator', function () {
  test('- encryptor retornando true:', async function () {
    const password = '123456';
    const hash = await encryptor(password);
    expect(bcrypt.compareSync(password, hash)).toBe(true);
  });

  test('- encryptor retornando false:', async function () {
    const password = '123456';
    const wrongPassword = '654321';
    const hash = await encryptor(password);
    expect(bcrypt.compareSync(wrongPassword, hash)).toBe(false);
  });

  test('- comparator retornando true:', async function () {
    const password = 'abcd';
    const hash = await encryptor(password);
    const verification = await comparator(password, hash);
    expect(verification).toBe(true);
  });

  test('- comparator retornando false:', async function () {
    const password = 'abcd';
    const verification = await comparator(password, 'efgh');
    expect(verification).toBe(false);
  });
});
