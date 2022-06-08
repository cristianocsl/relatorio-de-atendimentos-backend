const { BAD_REQUEST, CREATED } = require('http-status-codes').StatusCodes;
const { register: create } = require('../../services/user');
const writeSuccessMsg = require('../../services/utilities/successMsg');

const register = async (req, res) => {
  const reqBody = req.body; 
  try {
    const user = await create(reqBody);
    return res.status(CREATED).json(writeSuccessMsg(user.name));
  } catch (error) {
    console.error('registro de usuário > ', error.code, error.message);
    return res.status(BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = register;
