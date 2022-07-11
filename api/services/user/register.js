const { register: create, findUser } = require('../../models/user');
const { encryptor } = require('../utilities/bcryptFunction');
const ApiError = require('../../error/apiError');
const { EMAIL_EXISTING } = require('../../error/msgCodeError');
const { tokenGenerator } = require('../utilities/tokenGenerator');

const writeSuccessMsg = require('../utilities/successMsg');
const { validateRegister } = require('../validations/validateRegister');

const register = async ({ name, email, password }) => {
  await validateRegister({ name, email, password });
  const user = await findUser(email);
  if (user) throw new ApiError(EMAIL_EXISTING);
  const { _id } = await create(
    { name, email, password: await encryptor(password) },
  );

  const token = tokenGenerator({ _id, name, email });

  return {
    name: `${name.split(' ')[0]}`,
    email,
    userId: _id,
    message: writeSuccessMsg(name),
    token,
  };
};

module.exports = register;
