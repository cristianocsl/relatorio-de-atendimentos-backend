const { OK } = require('http-status-codes').StatusCodes;
const { login: loginWith } = require('../../services/user');

const login = async (req, res) => {
  const reqBody = req.body;
  try {
    const result = await loginWith(reqBody);
    return res.status(OK).json(result);
  } catch (err) {
    return res.status(err.code).json({ message: err.message });
  }
};

module.exports = login;
