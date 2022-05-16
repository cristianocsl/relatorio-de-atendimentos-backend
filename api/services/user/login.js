const bcrypt = require('bcrypt');

const { tokenGenerator } = require('../utilities/tokenGenerator');
const { findUserByEmail } = require('../../models/user');
const ApiError = require('../../error/apiError');
const { USER_DOES_NOT_EXIST, INCORRECT_LOGIN } = require('../../error/msgCodeError');

const login = async ({ email, password: inputPassword }) => {
  const user = await findUserByEmail(email);

  if (!user) return ApiError.SendToErrorMiddleware(USER_DOES_NOT_EXIST);
  const matchPassword = await bcrypt.compare(inputPassword, user.password);

  if (!matchPassword) return ApiError.SendToErrorMiddleware(INCORRECT_LOGIN);
  const { _id, name } = user;
  const token = tokenGenerator({ _id, name, email });

  return { name: `${name.split(' ')[0]}`, token };
};

module.exports = login;
