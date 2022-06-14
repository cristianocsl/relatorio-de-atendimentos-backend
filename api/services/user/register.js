const { register: create, findUser } = require('../../models/user');
const { encryptor } = require('../utilities/bcryptFunction');
const ApiError = require('../../error/apiError');
const { EMAIL_EXISTING } = require('../../error/msgCodeError');

const MyError = new ApiError(EMAIL_EXISTING);
const writeSuccessMsg = require('../utilities/successMsg');

const register = async ({ name, email, password, securityPhrase }) => {
  const user = await findUser(email);
  if (user) return MyError;
  const { _id: userId } = await create(
    { name, email, password: await encryptor(password), securityPhrase },
  );
  return {
    name: `${name.split(' ')[0]}`,
    email,
    userId,
    message: writeSuccessMsg(name),
  };
};

module.exports = register;
