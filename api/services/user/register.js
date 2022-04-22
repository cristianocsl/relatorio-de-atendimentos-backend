const { register: create, findUserByEmail } = require('../../models/user');

const register = async ({ name, email, password }) => {
  await findUserByEmail(email);
  await create({ name, email, password });
  return { name: `${name.split(' ')[0]}`, token: 'abc' };
};

module.exports = register;
