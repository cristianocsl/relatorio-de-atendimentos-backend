const bcrypt = require('bcrypt');

const { tokenGenerator } = require('../utilities/tokenGenerator');
const { findUser } = require('../../models/user');
const ApiError = require('../../error/apiError');
const { USER_DOES_NOT_EXIST, INCORRECT_PASSWORD } = require('../../error/msgCodeError');

const login = async ({ email, password: inputPassword }) => {
  const user = await findUser(email);

  if (!user) return ApiError.SendToErrorMiddleware(USER_DOES_NOT_EXIST);
  const matchPassword = await bcrypt.compare(inputPassword, user.password);

  if (!matchPassword) return ApiError.SendToErrorMiddleware(INCORRECT_PASSWORD);
  const { _id, name } = user;
  const token = tokenGenerator({ _id, name, email });

  return { name: `${name.split(' ')[0]}`, token };
};

module.exports = login;
