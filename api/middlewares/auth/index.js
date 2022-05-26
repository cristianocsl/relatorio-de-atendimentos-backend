const jwt = require('jsonwebtoken');
const ApiError = require('../../error/apiError');
const { TOKEN_NOT_FOUND, INVALID_TOKEN } = require('../../error/msgCodeError');
require('dotenv').config();

module.exports.authentication = (req, _res, next) => {
  const token = req.headers.authorization;
  if (!token) return ApiError.SendToErrorMiddleware(TOKEN_NOT_FOUND);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return ApiError.SendToErrorMiddleware(INVALID_TOKEN);
  }
};
