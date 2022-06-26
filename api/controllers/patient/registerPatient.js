const { CREATED } = require('http-status-codes').StatusCodes;
const { registerPatient: register } = require('../../services/patient');

module.exports.registerPatient = async (req, res) => {
  try {
    const { body, user: { _id: userId } } = req;
    const patient = await register({ ...body, userId });
    return res.status(CREATED).json(patient);
  } catch (err) {
    console.error(err);

    return res.status(err.code).json({ message: err.message });
  }
};
