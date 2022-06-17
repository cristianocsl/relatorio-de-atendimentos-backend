const jwt = require('jsonwebtoken');
const ApiError = require('../../error/apiError');
const { TOKEN_NOT_FOUND, INVALID_TOKEN } = require('../../error/msgCodeError');
require('dotenv').config();

module.exports.authentication = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) throw new ApiError(TOKEN_NOT_FOUND);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(INVALID_TOKEN);
  }
};
