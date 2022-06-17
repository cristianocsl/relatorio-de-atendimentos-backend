const { getAllPatientsFromUserId: getAll } = require('../../models/patient');

module.exports.getAllPatientsFromUserId = async (userId) => getAll(userId);
