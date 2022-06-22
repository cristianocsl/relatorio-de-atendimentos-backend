const ApiError = require('../../error/apiError');
const { EMPTY_FIELD, INVALID_EMAIL } = require('../../error/msgCodeError');

// eslint-disable-next-line max-len
const REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

module.exports.validateLogin = async (body) => {
  const { email, inputPassword } = body;
  if (!email.length) throw new ApiError(EMPTY_FIELD);
  if (!REGEX.test(email)) throw new ApiError(INVALID_EMAIL);
  if (!inputPassword.length) throw new ApiError(EMPTY_FIELD);
};
