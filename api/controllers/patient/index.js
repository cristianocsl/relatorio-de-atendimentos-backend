const { CREATED, BAD_REQUEST } = require('http-status-codes').StatusCodes;
const { registerPatient: register } = require('../../services/patient');

module.exports.registerPatient = async (req, res) => {
  const { body, user } = req;
  console.log('req >>', user);
  try {
    const patient = await register({ ...body });
    return res.status(CREATED).json(patient);
  } catch (err) {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }
};
