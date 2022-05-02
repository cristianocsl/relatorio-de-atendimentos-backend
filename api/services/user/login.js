const { findUserByEmail } = require('../../models/user');
const ApiError = require('../../error/apiError');
const { USER_DOES_NOT_EXIST } = require('../../error/msgCodeError');

const login = async ({ email/* , password: inputPassword */ }) => {
  const user = await findUserByEmail(email);
  if (!user) return ApiError.SendToErrorMiddleware(USER_DOES_NOT_EXIST);

  return { name: '', token: '' };
};

module.exports = login;
