const ApiError = require('../../error/apiError');
const { EMPTY_FIELD, INVALID_PASSWORD } = require('../../error/msgCodeError');

module.exports.validateLogin = async (body) => {
  const { email, inputPassword } = body;
  if (!email.length) throw new ApiError(EMPTY_FIELD);
  if (!inputPassword.length) throw new ApiError(EMPTY_FIELD);
  if (inputPassword.length < 6) throw new ApiError(INVALID_PASSWORD);
};
