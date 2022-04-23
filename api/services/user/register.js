const { register: create } = require('../../models/user');

const register = async ({ name, email, password, securityPhrase }) => {
  await create({ name, email, password, securityPhrase });
  return { name: `${name.split(' ')[0]}`, token: 'abc' };
};

module.exports = register;
