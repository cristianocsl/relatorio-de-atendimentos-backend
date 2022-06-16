const { OK } = require('http-status-codes').StatusCodes;
const { getAllPatientsFromUserId: getAll } = require('../../services/patient');

module.exports.getAllPatientsFromUserId = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const patients = await getAll(userId);

    return res.status(OK).json(patients);
  } catch (err) {
    return res.status(err).json(err);
  }
};
