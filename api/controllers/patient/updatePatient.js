const { OK } = require('http-status-codes').StatusCodes;
const { updatePatient: update } = require('../../services/patient');

module.exports.updatePatient = async (req, res) => {
  try {
    const { body, params: { patientId }, user: { _id: userId } } = req;
    const patient = await update(patientId, { ...body, userId });
    const successMsg = { message: 'Dados atualizados com sucesso!' };
    return res.status(OK).json({ ...patient, ...successMsg });
  } catch (err) {
    return res.status(err.code).json({ message: err.message });
  }
};