const { OK, BAD_REQUEST } = require('http-status-codes').StatusCodes;
const { updatePatient: update } = require('../../services/patient');

module.exports.updatePatient = async (req, res) => {
  const { body, params: { pacientId } } = req;
  try {
    const patient = await update(pacientId, body);
    return res.status(OK).json(patient);
  } catch (err) {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }
};