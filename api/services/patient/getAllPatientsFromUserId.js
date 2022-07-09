const { getAllPatientsFromUserId: getAll } = require('../../models/patient');
const { getFinances } = require('../../models/finances');

module.exports.getAllPatientsFromUserId = async (userId) => {
  const patients = await getAll(userId);
  const finances = await getFinances(userId);

  return { patients, finances };
};
