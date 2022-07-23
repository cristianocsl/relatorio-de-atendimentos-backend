const { OK } = require('http-status-codes').StatusCodes;
const ip = require('ip');
const { getAllPatientsFromUserId: getAll } = require('../../services/patient');

module.exports.getAllPatientsFromUserId = async (req, res) => {
  console.log('ip -> ', ip.address());
  const { _id: userId } = req.user;
  try {
    const patients = await getAll(userId);

    return res.status(OK).json(patients);
  } catch (err) {
    console.error(err);
    return res.status(err).json(err);
  }
};
