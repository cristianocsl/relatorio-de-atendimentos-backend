const ApiError = require('../../error/apiError');
const { EMPTY_FIELD, INVALID_PASSWORD, INVALID_EMAIL } = require('../../error/msgCodeError');

// eslint-disable-next-line max-len
const REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const validate = (email, password) => {
  if (!password.length || !email.length) throw new ApiError(EMPTY_FIELD);
};

module.exports.validateRegister = async (body) => {
  const { name, email, password } = body;
  if (!name.length) throw new ApiError(EMPTY_FIELD);
  validate(email, password);
  if (!REGEX.test(email)) throw new ApiError(INVALID_EMAIL);
  if (!password.length) throw new ApiError(EMPTY_FIELD);
  if (password.length < 6) throw new ApiError(INVALID_PASSWORD);
};