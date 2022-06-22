const { register: create, findUser } = require('../../models/user');
const { encryptor } = require('../utilities/bcryptFunction');
const ApiError = require('../../error/apiError');
const { EMAIL_EXISTING } = require('../../error/msgCodeError');

const writeSuccessMsg = require('../utilities/successMsg');
const { validateRegister } = require('../validations/validateRegister');

const register = async ({ name, email, password }) => {
  await validateRegister({ name, email, password });
  const user = await findUser(email);
  if (user) throw new ApiError(EMAIL_EXISTING);
  const { _id: userId } = await create(
    { name, email, password: await encryptor(password) },
  );
  return {
    name: `${name.split(' ')[0]}`,
    email,
    userId,
    message: writeSuccessMsg(name),
  };
};

module.exports = register;
