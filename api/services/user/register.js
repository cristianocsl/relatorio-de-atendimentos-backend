const { register: create, findUserByEmail } = require('../../models/user');
const { encryptor } = require('../utilities/bcryptFunction');

const { ApiError } = require('../../error/apiError');
const { EMAIL_EXISTING } = require('../../error/msgCodeError');

const register = async ({ name, email, password, securityPhrase }) => {
  const user = await findUserByEmail(email);
  if (user) return ApiError.SendToErrorMiddleware(EMAIL_EXISTING);
  await create({ name, email, password: await encryptor(password), securityPhrase });
  return { name: `${name.split(' ')[0]}`, token: 'abc' };
};

module.exports = register;
