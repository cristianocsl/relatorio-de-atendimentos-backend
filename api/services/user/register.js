const { encryptor } = require('../utilities/bcryptFunction');
const { register: create, findUserByEmail } = require('../../models/user');
const { ApiError: { SendToErrorMiddleware } } = require('../../error/apiError');
const { EMAIL_EXISTING } = require('../../error/msgCodeError');

const register = async ({ name, email, password }) => {
  const repetedEmail = await findUserByEmail(email);
  if (repetedEmail) return SendToErrorMiddleware(EMAIL_EXISTING);
  await create({ name, email, password: await encryptor(password) });
  return { name: `${name.split(' ')[0]}`, token: 'abc' };
};

module.exports = register;
