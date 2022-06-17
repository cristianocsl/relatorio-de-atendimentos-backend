const { BAD_REQUEST, CREATED } = require('http-status-codes').StatusCodes;
const { register: create } = require('../../services/user');

const register = async (req, res) => {
  const reqBody = req.body; 
  try {
    const user = await create(reqBody);
    return res.status(CREATED).json(user);
  } catch (error) {
    return res.status(BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = register;
